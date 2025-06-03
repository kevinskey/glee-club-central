
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Reply, 
  MoreHorizontal, 
  Send,
  MessageCircle,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    isVerified?: boolean;
  };
  content: string;
  timestamp: number; // Position in track where comment was made
  createdAt: Date;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  trackId: string;
}

export function CommentSection({ trackId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: {
        id: '1',
        name: 'Sarah Johnson',
        avatar: '/placeholder.svg',
        isVerified: true
      },
      content: 'Amazing vocal performance! The harmonies at 2:15 are absolutely beautiful 🎵',
      timestamp: 135, // 2:15
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: '2',
          user: {
            id: '2',
            name: 'Music Lover',
            avatar: '/placeholder.svg'
          },
          content: 'Totally agree! This part gives me chills every time',
          timestamp: 135,
          createdAt: new Date(Date.now() - 1000 * 60 * 20),
          likes: 3,
          isLiked: true
        }
      ]
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Alex Chen',
        avatar: '/placeholder.svg'
      },
      content: 'The Glee Club outdid themselves with this one! Can\'t wait for the live performance 👏',
      timestamp: 45,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      likes: 8,
      isLiked: false
    }
  ]);

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        id: 'current-user',
        name: 'You',
        avatar: '/placeholder.svg'
      },
      content: newComment,
      timestamp: 0, // Would be current playback position
      createdAt: new Date(),
      likes: 0,
      isLiked: false
    };

    if (replyTo) {
      // Add as reply
      setComments(prev => 
        prev.map(c => 
          c.id === replyTo 
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c
        )
      );
      setReplyTo(null);
    } else {
      // Add as new comment
      setComments(prev => [comment, ...prev]);
    }

    setNewComment('');
  };

  const toggleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(prev => 
      prev.map(comment => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.map(reply => 
              reply.id === commentId
                ? { 
                    ...reply, 
                    isLiked: !reply.isLiked,
                    likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1
                  }
                : reply
            )
          };
        } else if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          };
        }
        return comment;
      })
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({comments.length + comments.reduce((sum, c) => sum + (c.replies?.length || 0), 0)})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Add Comment */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            {replyTo && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setReplyTo(null)}
              >
                Cancel Reply
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                {replyTo ? 'Reply' : 'Comment'}
              </Button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.user.avatar} />
                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{comment.user.name}</span>
                    {comment.user.isVerified && (
                      <Badge variant="secondary" className="text-xs px-1 py-0">
                        ✓ Verified
                      </Badge>
                    )}
                    <button className="text-xs text-orange-600 hover:text-orange-800 font-mono">
                      @{formatTimestamp(comment.timestamp)}
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm">{comment.content}</p>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLike(comment.id)}
                      className={`gap-1 h-6 px-2 ${comment.isLiked ? 'text-red-500' : ''}`}
                    >
                      <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                      {comment.likes}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyTo(comment.id)}
                      className="gap-1 h-6 px-2"
                    >
                      <Reply className="w-3 h-3" />
                      Reply
                    </Button>
                    
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 space-y-3 border-l-2 border-muted pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={reply.user.avatar} />
                        <AvatarFallback>{reply.user.name[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{reply.user.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                        
                        <p className="text-sm">{reply.content}</p>
                        
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(reply.id, true, comment.id)}
                            className={`gap-1 h-5 px-1 text-xs ${reply.isLiked ? 'text-red-500' : ''}`}
                          >
                            <Heart className={`w-2.5 h-2.5 ${reply.isLiked ? 'fill-current' : ''}`} />
                            {reply.likes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
