import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  actionSlot?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actionSlot }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-accent tracking-tight">{title}</h1>
        <p className="text-gray-400 mt-1 text-sm">{description}</p>
      </div>
      {actionSlot && <div className="flex-shrink-0">{actionSlot}</div>}
    </div>
  );
};

export default PageHeader;
