import React from 'react';
import VirtualizedList from './VirtualizedList';
import { User } from '../types';

interface UserListProps {
  users: User[];
  onUserClick?: (user: User) => void;
  className?: string;
  height?: number | string;
}

const UserList: React.FC<UserListProps> = ({
  users,
  onUserClick,
  className = '',
  height = 400,
}) => {
  const renderUser = (user: User, index: number, style: React.CSSProperties) => {
    return (
      <div
        key={user.id}
        style={style}
        className="flex items-center p-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
        onClick={() => onUserClick && onUserClick(user)}
      >
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full" />
          ) : (
            <span className="text-gray-500 text-sm font-semibold">
              {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="ml-4 flex flex-col">
          <span className="text-sm font-medium text-gray-900">{user.name || 'Sem nome'}</span>
          <span className="text-sm text-gray-500">{user.email}</span>
        </div>
        <div className="ml-auto mr-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {user.roles.role_name}
          </span>
        </div>
      </div>
    );
  };

  return (
    <VirtualizedList
      items={users}
      rowHeight={64} // Altura de cada linha em pixels
      renderItem={renderUser}
      className={className}
      height={height}
    />
  );
};

export default UserList; 