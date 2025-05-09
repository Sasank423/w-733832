
import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

// Mock notification data
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'vote',
    message: 'CodeMaster upvoted your meme "When the code finally works"',
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
    read: false,
    link: '/meme/meme1',
    user: {
      id: 'user1',
      username: 'CodeMaster',
      avatar: ''
    }
  },
  {
    id: 2,
    type: 'comment',
    message: 'NightCoder commented on your meme "Debugging at 2am"',
    commentText: 'This is so relatable! Been there too many times! 😂',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    read: false,
    link: '/meme/meme2',
    user: {
      id: 'user2',
      username: 'NightCoder',
      avatar: ''
    }
  },
  {
    id: 3,
    type: 'achievement',
    message: 'Congratulations! Your meme reached 1,000 upvotes',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: true,
    link: '/meme/meme1',
  },
  {
    id: 4,
    type: 'system',
    message: 'Welcome to ImageGenHub! Create your first meme to get started.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
    link: '/create',
  },
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate unread notifications
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  const handleNotificationClick = (notificationId: number) => {
    // Mark notification as read
    setNotifications(notifications.map(notification => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast({
      title: "Notifications cleared",
      description: "All notifications marked as read",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'vote':
        return '👍';
      case 'comment':
        return '💬';
      case 'achievement':
        return '🏆';
      case 'system':
        return '🔔';
      default:
        return '🔔';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - notifTime.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-xs">
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-auto">
          <DropdownMenuGroup>
            {notifications.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                <p>No notifications yet!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className={`p-0 focus:bg-transparent ${!notification.read ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>
                  <Link 
                    to={notification.link} 
                    className="p-3 flex w-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="mr-3 flex-shrink-0">
                      {notification.user ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={notification.user.avatar} />
                          <AvatarFallback className="bg-brand-purple text-white">
                            {notification.user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-brand-purple-light">
                          <span>{getNotificationIcon(notification.type)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow overflow-hidden">
                      <p className="text-sm leading-snug line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.commentText && (
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400 italic line-clamp-1">
                          "{notification.commentText}"
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {getTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                    
                    {!notification.read && (
                      <div className="ml-2 flex-shrink-0 self-start mt-1">
                        <div className="h-2 w-2 rounded-full bg-brand-purple" />
                      </div>
                    )}
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/notifications" className="w-full justify-center">
            <span className="text-xs text-center">View all notifications</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationCenter;
