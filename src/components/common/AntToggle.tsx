import React from 'react';
import { Switch } from 'antd';

interface AntToggleProps {
  isActive: boolean;
  onToggle: (newState: boolean) => void;
  label: string;
}

const AntToggle: React.FC<AntToggleProps> = ({ isActive, onToggle, label }) => {
  return (
    <div className="flex items-center">
      <span className={`mr-2 ${isActive ? 'text-green-500' : 'text-red-500'}`}>
        {label}
      </span>
      <Switch
        checked={isActive}
        onChange={onToggle}
        className={`custom-toggle ${isActive ? 'bg-green-500' : 'bg-green-500'}`}
      />
    </div>
  );
};

export default AntToggle; 