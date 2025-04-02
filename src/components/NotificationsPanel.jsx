import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, limit, onSnapshot, updateDoc, doc, where } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);

  // Subscribe to notifications in real-time
  useEffect(() => {
    // Create query for latest 50 notifications, ordered by timestamp
    const notificationsQuery = query(
      collection(db, 'notifications'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firebase timestamp to JS Date
        timestamp: doc.data().timestamp?.toDate()
      }));
      
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.isRead).length);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle clicking outside to close panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      const updatePromises = unreadNotifications.map(notification => 
        updateDoc(doc(db, 'notifications', notification.id), {
          isRead: true
        })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Notification Bell Button */}
      <button
        onClick={togglePanel}
        className="p-2 rounded-lg hover:bg-secondary-50 text-secondary-600 relative"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-error text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-secondary-900/50 z-40" onClick={() => setIsOpen(false)} />
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="fixed md:absolute top-0 md:top-full right-0 w-full md:w-80 bg-white md:rounded-xl shadow-lg border border-secondary-200 z-50 md:mt-2 h-full md:h-auto max-h-full md:max-h-[calc(100vh-100px)] flex flex-col overflow-hidden">
          <div className="p-4 border-b border-secondary-100 flex items-center justify-between">
            <h3 className="font-semibold text-secondary-900">Notifications</h3>
            <button 
              className="md:hidden p-2 hover:bg-secondary-50 rounded-lg text-secondary-600"
              onClick={() => setIsOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-secondary-100">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 hover:bg-secondary-50 transition-colors cursor-pointer ${
                      notification.isRead ? 'bg-white' : 'bg-primary-50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-secondary-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-secondary-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-secondary-500 mt-1">
                          {notification.timestamp ? formatDistanceToNow(notification.timestamp, { addSuffix: true }) : ''}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <span className="h-2 w-2 bg-primary-600 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-secondary-600">
                No notifications
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-4 border-t border-secondary-100 bg-white">
              <button 
                onClick={markAllAsRead}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium w-full text-center transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;