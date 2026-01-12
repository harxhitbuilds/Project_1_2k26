interface ITechnology {
  name: string;
}

interface IOwner {
  _id: string;
  name: string;
  username: string;
  profile?: string;
}

interface IIdea {
  _id: string;
  title: string;
  description: string;
  owner: IOwner;
  technologies: ITechnology[];
  requirements: string[];
  status: "draft" | "open" | "in-progress" | "completed" | "archived";
  lookingForCollaboratos : boolean;
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type { IIdea, ITechnology };
