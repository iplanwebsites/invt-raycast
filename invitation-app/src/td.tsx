import React, { useMemo } from "react";
import { ActionPanel, Action, List } from "@raycast/api";
import { operatorData } from "./tdOperators";

// Types for our data structure
interface OperatorData {
  operators: {
    [key: string]: {
      description: string;
      operators?: string[];
      sweet_16?: Array<{
        name: string;
        purpose: string;
      }>;
      types?: {
        [key: string]: string[];
      };
    };
  };
}

export default function Command() {
  // Process the data to create a flat list of all operators with their family info
  const allOperators = useMemo(() => {
    const operators: Array<{
      id: string;
      title: string;
      subtitle: string;
      icon: string;
      url: string;
    }> = [];

    Object.entries(operatorData.operators).forEach(([family, data]) => {
      // Process regular operators
      if (Array.isArray(data.operators)) {
        data.operators.forEach((op) => {
          operators.push({
            id: `${family}-${op}`,
            title: op,
            subtitle: `${family} | ${data.description}`,
            icon: getFamilyIcon(family),
            url: `https://derivative.ca/UserGuide/${family}_${op.name.replace(/\s+/g, '_')}`
          });
        });
      }

      // Process sweet_16 operators
      if (data.sweet_16) {
        data.sweet_16.forEach((op) => {
          operators.push({
            id: `${family}-${op.name}`,
            title: op.name,
            subtitle: `${family} Sweet 16 | ${op.purpose}`,
            icon: getFamilyIcon(family),
            url: `https://derivative.ca/UserGuide/${family}_${op.name.replace(/\s+/g, '_')}`
          });
        });
      }

      // Process types (for COMP operators)
      if (data.types) {
        Object.entries(data.types).forEach(([type, ops]) => {
          ops.forEach((op) => {
            operators.push({
              id: `${family}-${op}`,
              title: op,
              subtitle: `${family} ${type} | ${data.description}`,
              icon: getFamilyIcon(family),
              url: `https://derivative.ca/UserGuide/${family}_${op.name.replace(/\s+/g, '_')}`
            });
          });
        });
      }
    });

    return operators;
  }, []);

  return (
    <List searchBarPlaceholder="Search TouchDesigner operators...">
      {allOperators.map((item) => (
        <List.Item
          key={item.id}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser
                title="Open Documentation"
                url={item.url}
              />
              <Action.CopyToClipboard 
                title="Copy Operator Name"
                content={item.title} 
              />
              <Action.CopyToClipboard 
                title="Copy Documentation URL"
                content={item.url} 
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

// Helper function to get an emoji icon for each operator family
function getFamilyIcon(family: string): string {
  const icons: { [key: string]: string } = {
    TOP: "🖼️",
    CHOP: "📊",
    SOP: "📐",
    MAT: "🎨",
    COMP: "🧩",
  };
  return icons[family] || "⚡";
}