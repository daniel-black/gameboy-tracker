import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function SongManager() {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Song Manager</CardTitle>
        <CardDescription>
          Manage the sequence of patterns to create a complete song.
        </CardDescription>
      </CardHeader>
      <CardContent>content here</CardContent>
    </Card>
  );
}
