/**
 * TableTreeView Component
 *
 * A reusable component for displaying hierarchical data in a table format with expand/collapse functionality.
 * This component uses your existing TTable component for consistent styling and behavior.
 *
 * Features:
 * - Automatically builds tree structure from flat array with id/parentId fields
 * - Expand/collapse functionality with arrow icons
 * - Proper indentation for nested levels
 * - Auto-expand to specified depth on mount
 * - Row click handler support
 * - Custom column rendering
 *
 * Usage:
 * ```tsx
 * <TableTreeView
 *   data={yourData}              // Flat array with id and parentId fields
 *   columns={columns}            // Column definitions
 *   defaultExpandedLevel={0}     // Auto-expand levels (0 = collapsed, 1 = first level, etc.)
 *   onRowClick={handleClick}     // Optional click handler
 *   fontSize="12px"              // Optional font size (default: "12px")
 * />
 * ```
 */

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {  IconButton } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowLeft } from "@mui/icons-material";
import TTable from "./TTable";
import { TableColumns } from "../../types/general";
import useCalculateTableHeight from "../../hooks/useCalculateTableHeight";
import Skeleton from "../layout/Skeleton";

export interface TreeItem {
  id: string | number;
  parentId?: string | number | null;
  [key: string]: any;
}

export interface TableTreeColumn<T = any> {
  header: string;
  accessor: keyof T | string;
  width?: string;
  align?: string;
  backgroundColor?: string;
  render?: (item: T, level: number) => React.ReactNode;
}

interface TableTreeViewProps<T extends TreeItem> {
  data: T[];
  columns: TableTreeColumn<T>[];
  defaultExpandedLevel?: number; // Auto-expand to this level (0 = root only, 1 = root + children, etc.)
  onRowClick?: (item: T) => void;
  fontSize?: string;
  expandAll?: boolean;
  showHeader?: boolean;
  isLoading?: boolean;
}

interface TreeNode<T> extends TreeItem {
  children: TreeNode<T>[];
  level: number;
  originalData: T;
}

export function TableTreeView<T extends TreeItem>({
  data = [],
  columns,
  defaultExpandedLevel = 0,
  onRowClick,
  fontSize = "12px",
  expandAll,
  showHeader = false,
  isLoading = false,
}: TableTreeViewProps<T>) {
  // Build tree structure from flat array
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const tree = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    const itemMap = new Map<string | number, TreeNode<T>>();
    const rootItems: TreeNode<T>[] = [];

    // First pass: create nodes
    data.forEach((item) => {
      if (item && item.id !== undefined && item.id !== null) {
        itemMap.set(item.id, {
          ...item,
          children: [],
          level: 0,
          originalData: item,
        });
      }
    });

    // Second pass: build hierarchy
    data.forEach((item) => {
      if (!item || item.id === undefined || item.id === null) return;

      const node = itemMap.get(item.id);
      if (!node) return;

      if (item.parentId === null || item.parentId === undefined) {
        rootItems.push(node);
      } else {
        const parent = itemMap.get(item.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // If parent not found, treat as root
          rootItems.push(node);
        }
      }
    });

    // Set levels recursively
    const setLevels = (nodes: TreeNode<T>[], level: number) => {
      nodes.forEach((node) => {
        node.level = level;
        if (node.children.length > 0) {
          setLevels(node.children, level + 1);
        }
      });
    };
    setLevels(rootItems, 0);

    return rootItems;
  }, [data]);

  // Helper function to calculate expanded IDs based on expandAll and defaultExpandedLevel
  const calculateExpandedIds = useCallback(
    (
      nodes: TreeNode<T>[],
      expandAllValue: boolean | undefined,
      defaultLevel: number
    ): Set<string | number> => {
      const expanded = new Set<string | number>();

      if (expandAllValue === true) {
        // Expand all nodes with children
        const expandAllNodes = (nodeList: TreeNode<T>[]) => {
          nodeList.forEach((node) => {
            if (node.children.length > 0) {
              expanded.add(node.id);
              expandAllNodes(node.children);
            }
          });
        };
        expandAllNodes(nodes);
      } else if (expandAllValue === false) {
        // Collapse all - return empty set
        return expanded;
      } else if (defaultLevel > 0) {
        // Use defaultExpandedLevel when expandAll is undefined
        const expandToLevel = (
          nodeList: TreeNode<T>[],
          currentLevel: number
        ) => {
          nodeList.forEach((node) => {
            if (currentLevel < defaultLevel && node.children.length > 0) {
              expanded.add(node.id);
              expandToLevel(node.children, currentLevel + 1);
            }
          });
        };
        expandToLevel(nodes, 0);
      }

      return expanded;
    },
    []
  );

  // Track expanded state
  const [expandedIds, setExpandedIds] = useState<Set<string | number>>(() => {
    return calculateExpandedIds(tree, expandAll, defaultExpandedLevel);
  });

  // Handle expandAll and tree changes
  useEffect(() => {
    const newExpandedIds = calculateExpandedIds(
      tree,
      expandAll,
      defaultExpandedLevel
    );
    setExpandedIds(newExpandedIds);
  }, [expandAll, tree, defaultExpandedLevel, calculateExpandedIds]);

  const toggleExpand = useCallback(
    (id: string | number, e: React.MouseEvent) => {
      e.stopPropagation();
      setExpandedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    []
  );

  // Flatten tree for rendering based on expanded state
  const flattenedRows = useMemo(() => {
    const result: TreeNode<T>[] = [];

    const traverse = (nodes: TreeNode<T>[]) => {
      nodes.forEach((node) => {
        result.push(node);
        if (expandedIds.has(node.id) && node.children.length > 0) {
          traverse(node.children);
        }
      });
    };

    traverse(tree);
    return result;
  }, [tree, expandedIds]);

  const hasChildren = (item: TreeNode<T>) => item.children.length > 0;
  const isExpanded = (id: string | number) => expandedIds.has(id);

  // Prepare data for TTable with expand/collapse functionality
  const tableData = useMemo(() => {
    return flattenedRows.map((row) => ({
      ...row.originalData,
      _level: row.level,
      _hasChildren: hasChildren(row),
      _isExpanded: isExpanded(row.id),
      _treeNodeId: row.id,
      _expandCollapse: "", // Dummy value for the expand column
    }));
  }, [flattenedRows, expandedIds]);

  // Convert columns to TTable format
  const tableColumns: TableColumns = useMemo(() => {
    const expandColumn = {
      Header: "",
      accessor: "_expandCollapse",
      width: "40px",
      noLeftBorder: true,
      Cell: (props: any) => {
        try {
          const { row } = props;
          const level = row?.original?._level || 0;
          const hasChildrenFlag = row?.original?._hasChildren || false;
          const isExpandedFlag = row?.original?._isExpanded || false;
          const nodeId = row?.original?._treeNodeId;

          return (
            <div
              style={{
                paddingLeft: `${level * 20}px`,
                display: "flex",
                alignItems: "center",
                height: "100%",
                minHeight: "28px",
              }}
            >
              {hasChildrenFlag ? (
                <IconButton
                  size="small"
                  onClick={(e) => toggleExpand(nodeId, e)}
                  sx={{
                    padding: "2px",
                    margin: 0,
                    width: "28px",
                    height: "28px",
                  }}
                >
                  {isExpandedFlag ? (
                    <KeyboardArrowDown fontSize="small" />
                  ) : (
                    <KeyboardArrowLeft fontSize="small" />
                  )}
                </IconButton>
              ) : (
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    display: "inline-block",
                  }}
                />
              )}
            </div>
          );
        } catch (error) {
          console.error("Error in expand column Cell:", error);
          return <span />;
        }
      },
    };

    const dataColumns = columns.map((col, index) => {
      const baseColumn: any = {
        Header: col.header,
        accessor: col.accessor as string,
        width: col.width,
        align: col.align,
        backgroundColor: col.backgroundColor,
      };

      // Add Cell renderer only if needed
      if (col.render) {
        baseColumn.Cell = (props: any) => {
          try {
            const { row } = props;
            const level = row?.original?._level || 0;
            const indent = index === 0 ? level * 20 : 0;
            return (
              <div
                style={{
                  paddingRight: `${indent}px`,
                  display: "flex",
                  alignItems: "center",
                  minHeight: "28px",
                }}
              >
                {col.render!(row.original, level)}
              </div>
            );
          } catch (error) {
            console.error(
              `Error in column ${String(col.accessor)} Cell with render:`,
              error
            );
            return <span />;
          }
        };
      } else if (index === 0) {
        // First column gets indentation
        baseColumn.Cell = (props: any) => {
          try {
            const { row, value } = props;
            const level = row?.original?._level || 0;
            return (
              <div
                style={{
                  paddingRight: `${level * 20}px`,
                  display: "flex",
                  alignItems: "center",
                  minHeight: "28px",
                }}
              >
                {value !== undefined && value !== null ? String(value) : ""}
              </div>
            );
          } catch (error) {
            console.error(
              `Error in first column ${String(col.accessor)} Cell:`,
              error
            );
            return <span />;
          }
        };
      }

      return baseColumn;
    });

    return [expandColumn, ...dataColumns];
  }, [columns, toggleExpand]);

  // Debug logging
  /*if (process.env.NODE_ENV === 'development') {
    console.log('TableTreeView render:', {
      dataLength: data.length,
      treeLength: tree.length,
      flattenedRowsLength: flattenedRows.length,
      tableDataLength: tableData.length,
      columnsLength: tableColumns.length,
    });*
  }*/

  const { height, width } = useCalculateTableHeight();
  return (
    <div
      className="w-full overflow-y-auto"
      style={width > 640 ? { height: height - 50 } : { height: "fit" }}
    >
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Skeleton />
        </div>
      ) : (
        <TTable
          columns={tableColumns}
          selectedRowIndex={selectedRowIndex}
          setSelectedRowIndex={setSelectedRowIndex}
          data={tableData}
          fontSize={fontSize}
          changeRowSelectColor={true}
          showHeader={showHeader}
          setSelectedId={
            onRowClick
              ? (id: number) => {
                  const item = flattenedRows.find((row) => row.id === id);
                  if (item) {
                    onRowClick(item.originalData);
                  }
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
