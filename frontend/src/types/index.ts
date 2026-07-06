export interface Posts {
    _id: string;
    content: string;
    image?: string;
    author: { _id: string; name: string; username: string, avatar?: string };
    likes: string[];
    comments: { _id: string, text: string, user: string }[];
    createdAt: string;
}

export type Props =  {
    children: React.ReactNode;
};