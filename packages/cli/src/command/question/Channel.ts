import { Command } from 'commander';
import { prompt } from 'inquirer';

export interface ChannelDescriptionQuery {
  name?: string;
  description?: string;
  logo?: string;
}
export async function DescribeChannel(
  cmd: Command,
  qChannelDescription: ChannelDescriptionQuery,
) {
  // Get description from user
  // If the name is passed, bypass all questions
  const answer = await prompt([
    {
      name: 'name',
      message: 'Enter the channel name',
      when: () => !cmd.channelName,
      default: null,
    },
    {
      name: 'description',
      message: 'Enter a description',
      when: () => !cmd.channelDesc && !cmd.channelName,
      default: null,
    },
    {
      name: 'logo',
      message: 'Enter a logo URL',
      when: () => !cmd.channelLogo && !cmd.channelName,
      default: null,
    },
  ]);

  qChannelDescription.name = cmd.channelName || answer.name;
  qChannelDescription.description = cmd.channelDesc || answer.description;
  qChannelDescription.logo = cmd.channelLogo || answer.logo;
}
