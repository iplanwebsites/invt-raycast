import { ActionPanel, closeMainWindow, Action, Icon, List, open } from "@raycast/api";
import { getIcon } from "./invt/resultUtils";
import { useSearch } from "./invt/useSearch.tsx";

export default function Command() {
  const { isLoading, results, search, addHistory, deleteAllHistory, deleteHistoryItem } = useSearch("GENERAL");

  return (
    <List 
      isLoading={isLoading} 
      onSearchTextChange={search} 
      searchBarPlaceholder="Search Naver or enter a URL..."
    >
      <List.Section title="Results" subtitle={results.length.toString()}>
        {results.map((item) => (
          <List.Item
            key={item.id}
            title={item.query}
            subtitle={item.description}
            icon={getIcon(item)}
            actions={
              <ActionPanel>
                <ActionPanel.Section title="Result">
                  <Action
                    title="Open in Browser"
                    onAction={async () => {
                      await addHistory(item);
                      await open(item.url);
                      await closeMainWindow();
                    }}
                    icon={Icon.ArrowRight}
                  />
                  <Action.CopyToClipboard title="Copy URL to Clipboard" content={item.url} />
                  <Action.CopyToClipboard title="Copy Suggestion to Clipboard" content={item.query} />
                </ActionPanel.Section>

                <ActionPanel.Section title="History">
                  {item.isHistory && (
                    <Action
                      title="Remove From History"
                      onAction={async () => {
                        await deleteHistoryItem(item);
                      }}
                      icon={Icon.ExclamationMark}
                      shortcut={{ modifiers: ["cmd"], key: "d" }}
                    />
                  )}
                  <Action
                    title="Clear All History"
                    onAction={async () => {
                      await deleteAllHistory();
                    }}
                    icon={Icon.ExclamationMark}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}