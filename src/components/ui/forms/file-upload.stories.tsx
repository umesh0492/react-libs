import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { FileUpload, FileItem } from "./file-upload";

const meta: Meta<typeof FileUpload> = {
  title: "Forms/FileUpload",
  component: FileUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
  render: () => {
    const [files, setFiles] = React.useState<FileItem[]>([]);
    return (
      <div className="w-[480px]">
        <FileUpload
          value={files}
          onChange={setFiles}
          label="Upload project documents"
          description="PDF, DOCX, PNG, or JPG up to 10MB"
        />
      </div>
    );
  },
};

export const SingleFile: Story = {
  render: () => {
    const [files, setFiles] = React.useState<FileItem[]>([]);
    return (
      <div className="w-[480px]">
        <FileUpload
          value={files}
          onChange={setFiles}
          multiple={false}
          label="Upload invoice receipt"
          description="Single PDF or image file"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "File upload disabled",
    description: "You do not have permission to upload files",
  },
  render: (args) => (
    <div className="w-[480px]">
      <FileUpload {...args} />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    error: "File upload failed. Please try again.",
    label: "Upload attachments",
  },
  render: (args) => (
    <div className="w-[480px]">
      <FileUpload {...args} />
    </div>
  ),
};
