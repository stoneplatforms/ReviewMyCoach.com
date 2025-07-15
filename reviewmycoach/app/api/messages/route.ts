import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, orderBy, getDocs, addDoc, updateDoc, limit } from 'firebase/firestore';
import { auth } from '../../lib/firebase-admin';

// Initialize Firebase client
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const clientApp = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const clientDb = getFirestore(clientApp);

// GET - Fetch messages for a conversation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId');
    const limitCount = parseInt(searchParams.get('limit') || '50');

    if (!conversationId && !userId) {
      return NextResponse.json({ error: 'conversationId or userId is required' }, { status: 400 });
    }

    if (conversationId) {
      // Fetch messages for a specific conversation
      const messagesRef = collection(clientDb, 'conversations', conversationId, 'messages');
      const messagesQuery = query(
        messagesRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(messagesQuery);
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
      })).reverse(); // Reverse to show oldest first

      return NextResponse.json({ messages });
    } else {
      // Fetch all conversations for a user
      const conversationsRef = collection(clientDb, 'conversations');
      const conversationsQuery = query(
        conversationsRef,
        where('participants', 'array-contains', userId),
        orderBy('lastMessageAt', 'desc')
      );

      const snapshot = await getDocs(conversationsQuery);
      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        lastMessageAt: doc.data().lastMessageAt?.toDate().toISOString(),
      }));

      return NextResponse.json({ conversations });
    }

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST - Send a new message
export async function POST(request: NextRequest) {
  try {
    const { recipientId, message, conversationId, idToken } = await request.json();

    // Verify authentication
    if (!idToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

      let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
  }

  const senderId = decodedToken.uid;

    // Validate required fields
    if (!recipientId || !message?.trim()) {
      return NextResponse.json({ error: 'recipientId and message are required' }, { status: 400 });
    }

    // Get sender profile
    const senderCoachesRef = collection(clientDb, 'coaches');
    const senderQuery = query(senderCoachesRef, where('userId', '==', senderId));
    const senderSnapshot = await getDocs(senderQuery);
    
    let senderProfile = null;
    if (!senderSnapshot.empty) {
      senderProfile = senderSnapshot.docs[0].data();
    }

    // If sender is not a coach, check if they're a user
    if (!senderProfile) {
      const userDoc = await getDoc(doc(clientDb, 'users', senderId));
      if (userDoc.exists()) {
        senderProfile = userDoc.data();
      }
    }

    if (!senderProfile) {
      return NextResponse.json({ error: 'Sender profile not found' }, { status: 404 });
    }

    // Get or create conversation
    let currentConversationId = conversationId;
    
    if (!currentConversationId) {
      // Create conversation ID (consistent ordering)
      const participants = [senderId, recipientId].sort();
      currentConversationId = `${participants[0]}_${participants[1]}`;
      
      // Check if conversation already exists
      const conversationRef = doc(clientDb, 'conversations', currentConversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (!conversationDoc.exists()) {
        // Create new conversation
        await setDoc(conversationRef, {
          participants: [senderId, recipientId],
          createdAt: new Date(),
          lastMessageAt: new Date(),
          lastMessage: message.trim(),
          lastMessageSender: senderId,
          unreadCount: {
            [senderId]: 0,
            [recipientId]: 1
          }
        });
      }
    }

    // Add message to conversation
    const messagesRef = collection(clientDb, 'conversations', currentConversationId, 'messages');
    const messageData = {
      senderId,
      senderName: senderProfile.displayName || senderProfile.username || 'Unknown',
      recipientId,
      message: message.trim(),
      createdAt: new Date(),
      read: false
    };

    const messageRef = await addDoc(messagesRef, messageData);

    // Update conversation with last message
    const conversationRef = doc(clientDb, 'conversations', currentConversationId);
    await updateDoc(conversationRef, {
      lastMessageAt: new Date(),
      lastMessage: message.trim(),
      lastMessageSender: senderId,
      [`unreadCount.${recipientId}`]: (await getDoc(conversationRef)).data()?.unreadCount?.[recipientId] || 0 + 1
    });

    // Send email notification to recipient
    try {
      // Get recipient profile
      const recipientCoachesRef = collection(clientDb, 'coaches');
      const recipientQuery = query(recipientCoachesRef, where('userId', '==', recipientId));
      const recipientSnapshot = await getDocs(recipientQuery);
      
      let recipientProfile = null;
      if (!recipientSnapshot.empty) {
        recipientProfile = recipientSnapshot.docs[0].data();
      }

      // If recipient is not a coach, check if they're a user
      if (!recipientProfile) {
        const userDoc = await getDoc(doc(clientDb, 'users', recipientId));
        if (userDoc.exists()) {
          recipientProfile = userDoc.data();
        }
      }

      if (recipientProfile && recipientProfile.email) {
        await fetch('/api/notifications/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'message_received',
            recipientEmail: recipientProfile.email,
            recipientName: recipientProfile.displayName || recipientProfile.username,
            data: {
              senderName: senderProfile.displayName || senderProfile.username,
              message: message.trim()
            },
            idToken: idToken
          }),
        });
      }
    } catch (error) {
      console.error('Error sending message notification email:', error);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      messageId: messageRef.id,
      conversationId: currentConversationId,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// PUT - Mark messages as read
export async function PUT(request: NextRequest) {
  try {
    const { conversationId, userId, idToken } = await request.json();

    // Verify authentication
    if (!idToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

      let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
  }

  if (decodedToken.uid !== userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Reset unread count for user
    const conversationRef = doc(clientDb, 'conversations', conversationId);
    await updateDoc(conversationRef, {
      [`unreadCount.${userId}`]: 0
    });

    // Mark all messages in conversation as read for this user
    const messagesRef = collection(clientDb, 'conversations', conversationId, 'messages');
    const messagesQuery = query(
      messagesRef,
      where('recipientId', '==', userId),
      where('read', '==', false)
    );

    const snapshot = await getDocs(messagesQuery);
    const updatePromises = snapshot.docs.map(doc => 
      updateDoc(doc.ref, { read: true })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: 'Messages marked as read'
    });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    );
  }
} 