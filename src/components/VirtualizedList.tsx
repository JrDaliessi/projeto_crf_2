import React from 'react';
import { AutoSizer, List, ListRowProps } from 'react-virtualized';
import 'react-virtualized/styles.css';

interface VirtualizedListProps<T> {
  items: T[];
  rowHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  className?: string;
  height?: number | string;
  width?: number | string;
  overscanRowCount?: number;
}

function VirtualizedList<T>({
  items,
  rowHeight,
  renderItem,
  className = '',
  height = 400,
  width = '100%',
  overscanRowCount = 10,
}: VirtualizedListProps<T>) {
  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    return renderItem(items[index], index, style);
  };

  return (
    <div style={{ height, width }} className={className}>
      <AutoSizer>
        {({ height: autoHeight, width: autoWidth }) => (
          <List
            height={autoHeight}
            width={autoWidth}
            rowCount={items.length}
            rowHeight={rowHeight}
            rowRenderer={rowRenderer}
            overscanRowCount={overscanRowCount}
          />
        )}
      </AutoSizer>
    </div>
  );
}

export default VirtualizedList; 