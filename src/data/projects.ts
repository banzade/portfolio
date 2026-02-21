export interface Project {
  name: string;
  description: string;
  link: string;
}

export const projects: Project[] = [
  {
    name: 'Project 1',
    description: 'Your Description Here',
    link: '#',
  },
  {
    name: 'Dotfiles',
    description: 'My personal configuration files for various tools and applications, showcasing my setup and customizations.',
    link: 'https://github.com/banzade/dotfiles',
  },
  {
    name: 'Custom MCP Server for Atlassian Confluence, Jira, and Bitbucket',
    description: 'A custom MCP server for Atlassian Confluence, Jira, and Bitbucket.',
    link: '#',
  },
];
