import { Bot, Cloud, CodeXml, Layers3 } from "lucide-react";

export function ServiceIcon({ service }: { service: string }) {
  const Icon = { "ai-automation": Bot, "software-development": CodeXml, cloud: Cloud }[service] ?? Layers3;
  return <Icon aria-hidden="true" size={24} />;
}
