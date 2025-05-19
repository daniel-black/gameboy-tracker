import { Card, CardContent, CardHeader } from "./ui/card";

export function Song() {
  return (
    <Card>
      <CardHeader>Song</CardHeader>
      <CardContent className="text-xs">
        <div>songs stuff</div>
      </CardContent>
    </Card>
  );
}
