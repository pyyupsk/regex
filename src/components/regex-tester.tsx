"use client";

import { Copy, Plus } from "lucide-react";
import {
  parseAsBoolean,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cheatSheet } from "@/constants/cheatsheet";
import { cn } from "@/lib/utils";

export function RegexTester() {
  const [pattern, setPattern] = useQueryState<string>(
    "pattern",
    parseAsString.withDefault(""),
  );
  const [testString, setTestString] = useState<string>("");
  const [flags, setFlags] = useQueryStates({
    global: parseAsBoolean.withDefault(true),
    caseInsensitive: parseAsBoolean.withDefault(true),
    multiline: parseAsBoolean.withDefault(true),
  });
  const [isValidPattern, setIsValidPattern] = useState<boolean>(true);

  useEffect(() => testRegex());

  const testRegex = useCallback((): void => {
    if (pattern) {
      try {
        new RegExp(pattern);
        setIsValidPattern(true);
      } catch {
        setIsValidPattern(false);
      }
    } else {
      setIsValidPattern(true);
    }
  }, [pattern]);

  const highlightMatches = useCallback(
    (text: string): React.ReactNode => {
      if (!pattern || !isValidPattern) return text;
      try {
        const flagString = `${flags.global ? "g" : ""}${flags.caseInsensitive ? "i" : ""}${flags.multiline ? "m" : ""}`;
        const re = new RegExp(pattern, flagString);

        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match: RegExpExecArray | null = null;

        if (flags.global) {
          match = re.exec(text);
          while (match !== null) {
            if (match.index > lastIndex) {
              parts.push(text.slice(lastIndex, match.index));
            }
            parts.push(
              <mark
                key={`match-${match.index}`}
                className="bg-yellow-200 dark:bg-yellow-600"
              >
                {match[0]}
              </mark>,
            );
            lastIndex = re.lastIndex;
            match = re.exec(text);
          }
          if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
          }
        } else {
          match = re.exec(text);
          if (match) {
            if (match.index > 0) {
              parts.push(text.slice(0, match.index));
            }
            parts.push(
              <mark
                key={`match-${match.index}`}
                className="bg-yellow-200 dark:bg-yellow-600"
              >
                {match[0]}
              </mark>,
            );
            if (match.index + match[0].length < text.length) {
              parts.push(text.slice(match.index + match[0].length));
            }
          } else {
            return text;
          }
        }

        return parts.length > 0 ? parts : text;
      } catch {
        return text;
      }
    },
    [
      pattern,
      isValidPattern,
      flags.global,
      flags.caseInsensitive,
      flags.multiline,
    ],
  );

  const copyToClipboard = (text: string): void =>
    void navigator.clipboard.writeText(text);

  return (
    <div className="container space-y-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Regex Tester</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="pattern">Enter your regex:</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="pattern"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter regex pattern"
                  className={cn(
                    "flex-grow",
                    !isValidPattern &&
                      "border-destructive ring-destructive focus-visible:ring-destructive",
                  )}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(pattern)}
                      >
                        <Copy />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy regex</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {!isValidPattern && (
                <p className="mt-1 text-sm text-destructive">
                  Invalid regex pattern
                </p>
              )}
            </div>
            <div className="md flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
              {[
                { id: "global", label: "Global (g)" },
                { id: "caseInsensitive", label: "Case Insensitive (i)" },
                { id: "multiline", label: "Multiline (m)" },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={flags[id as keyof typeof flags]}
                    onCheckedChange={(e) =>
                      setFlags({
                        ...flags,
                        [id]: Boolean(e),
                      })
                    }
                  />
                  <Label htmlFor={id}>{label}</Label>
                </div>
              ))}
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="testString">Test string:</Label>
              <Textarea
                id="testString"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                placeholder="Enter test string"
                rows={5}
                className="whitespace-pre"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="result">Result:</Label>
              <ScrollArea className="h-48 rounded border p-2">
                <p className="whitespace-pre-wrap">
                  {highlightMatches(testString)}
                </p>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Regex Cheatsheet</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="Basic Characters">
            <TabsList className="mb-4 hidden md:grid md:grid-cols-3 lg:grid-cols-5">
              {Object.keys(cheatSheet).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="text-xs md:text-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="mb-4 flex flex-wrap gap-2 md:hidden">
              {Object.keys(cheatSheet).map((category) => (
                <Button key={category} variant="outline">
                  {category}
                </Button>
              ))}
            </div>
            {Object.entries(cheatSheet).map(([category, items]) => (
              <TabsContent key={category} value={category}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pattern</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.pattern}>
                        <TableCell>
                          <code className="rounded bg-muted px-2 py-1 text-foreground">
                            {item.pattern}
                          </code>
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      setPattern(pattern + item.pattern)
                                    }
                                  >
                                    <Plus />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Add to regex</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      copyToClipboard(item.pattern)
                                    }
                                  >
                                    <Copy />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy pattern</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
