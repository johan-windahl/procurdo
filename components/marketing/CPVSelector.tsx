"use client";

import { useMemo, useState } from "react";
import data from "@/data/cpv.json";

type Node = {
  code: string;
  name: string;
  children?: Node[];
};

type Props = {
  value: string[];
  onChange: (codes: string[]) => void;
};

export default function CPVSelector({ value, onChange }: Props) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Fast lookup by code
  const nodeMap = useMemo(() => {
    const map = new Map<string, Node>();
    (data as Node[]).forEach((node) => {
      map.set(node.code, node);
    });
    return map;
  }, []);

  // Top-level main divisions (XX000000)
  const topLevelNodes = useMemo(() => {
    return (data as Node[]).filter((node) => node.code.endsWith("000000"));
  }, []);

  // Compute children dynamically if not present in JSON
  const getChildrenForNode = useMemo(() => {
    return (nodeCode: string): Node[] => {
      const node = nodeMap.get(nodeCode);
      if (node && node.children && node.children.length > 0) {
        return node.children;
      }

      const all = data as Node[];
      const children: Node[] = [];

      if (nodeCode.endsWith("000000")) {
        // Main division (XX000000) -> groups (XXX00000)
        const prefix = nodeCode.substring(0, 2);
        children.push(
          ...all.filter(
            (n) =>
              n.code.startsWith(prefix) &&
              n.code.endsWith("00000") &&
              n.code !== nodeCode &&
              n.code.length === 8
          )
        );
      } else if (nodeCode.endsWith("00000")) {
        // Group (XXX00000) -> subgroups (XXXX0000)
        const prefix = nodeCode.substring(0, 3);
        children.push(
          ...all.filter(
            (n) =>
              n.code.startsWith(prefix) &&
              n.code.endsWith("0000") &&
              n.code !== nodeCode &&
              n.code.length === 8
          )
        );
      } else if (nodeCode.endsWith("0000")) {
        // Subgroup (XXXX0000) -> categories (XXXXX000)
        const prefix = nodeCode.substring(0, 4);
        children.push(
          ...all.filter(
            (n) =>
              n.code.startsWith(prefix) &&
              n.code.endsWith("000") &&
              n.code !== nodeCode &&
              n.code.length === 8
          )
        );
      } else if (nodeCode.endsWith("000")) {
        // Category (XXXXX000) -> subcategories and individual codes
        const prefix = nodeCode.substring(0, 5);
        children.push(
          ...all.filter(
            (n) =>
              n.code.startsWith(prefix) &&
              n.code !== nodeCode &&
              n.code.length === 8 &&
              !n.code.endsWith("000")
          )
        );
      }

      return children;
    };
  }, [nodeMap]);

  const toggleExpansion = (nodeCode: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeCode)) next.delete(nodeCode);
      else next.add(nodeCode);
      return next;
    });
  };

  const toggleSelection = (node: Node, checked: boolean) => {
    const codes = new Set(value);
    if (checked) codes.add(node.code);
    else codes.delete(node.code);
    onChange(Array.from(codes));
  };

  const renderNode = (node: Node) => {
    const isExpanded = expandedNodes.has(node.code);
    const children = getChildrenForNode(node.code);
    const hasChildren = children.length > 0;
    const isSelected = value.includes(node.code);

    return (
      <li key={node.code} className="mb-1">
        <div className="flex items-center gap-2 p-1 rounded hover:bg-accent/40">
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpansion(node.code);
              }}
              className="w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-foreground"
              aria-expanded={isExpanded}
            >
              {isExpanded ? "▼" : "▶"}
            </button>
          ) : (
            <div className="w-4" />
          )}

          <input
            id={`cpv-${node.code}`}
            type="checkbox"
            checked={isSelected}
            onChange={(e) => toggleSelection(node, e.target.checked)}
            className="h-4 w-4"
          />

          <label htmlFor={`cpv-${node.code}`} className="text-sm">
            <span className="font-mono text-muted-foreground mr-2">{node.code}</span>
            {node.name}
          </label>
        </div>
        {hasChildren && isExpanded ? (
          <ul className="mt-1 ml-4">
            {children.map((child) => renderNode(child))}
          </ul>
        ) : null}
      </li>
    );
  };

  const clearAllSelections = () => {
    onChange([]);
    setExpandedNodes(new Set());
  };

  return (
    <div className="rounded-md border bg-card p-3">
      <div className="mb-2 flex justify-between items-center">
        <div className="text-sm font-medium">
          CPV-koder ({value.length} valda) - {topLevelNodes.length} kategorier att expandera
        </div>
        {value.length > 0 ? (
          <button
            type="button"
            onClick={clearAllSelections}
            className="px-3 py-1 text-xs rounded border hover:bg-accent"
            title="Rensa alla val"
          >
            Rensa
          </button>
        ) : null}
      </div>
      <div className="max-h-96 overflow-y-auto">
        <ul className="space-y-1">
          {topLevelNodes.map((node) => renderNode(node))}
        </ul>
      </div>
    </div>
  );
}
