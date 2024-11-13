import { useSearch } from "./invt/useSearch";

export default function Command() {
  const { isLoading, results, search, error } = useSearch();
  
  // Your component implementation
  return (
    <List isLoading={isLoading}>
      {results.map((result, index) => (
        <List.Item 
          key={index}
          title={result.title} // adjust based on your result structure
        />
      ))}
    </List>
  );
}