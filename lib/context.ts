import type { ProjectOption, Service } from "./catalog";

export function resolveContext(service: string, project: string, services: Service[], projects: ProjectOption[]) {
  const validService = service === "" || services.some(item => item.slug === service);
  const match = projects.find(item => item.slug === project);
  const validProject = project === "" || Boolean(match && (!service || match.services.includes(service)));
  return {
    service: validService ? service : "",
    project: validProject ? project : "",
    valid: validService && validProject,
  };
}
