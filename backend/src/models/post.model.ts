import mongoose, { Document, Schema, Types } from "mongoose";

interface IComment {
    _id?: Types.ObjectId;
    user: Types.ObjectId;     // Who comment
    text: string;             // Comment content
    createdAt: Date;           // time of content created
}

interface IPost extends Document {
    author: Types.ObjectId;
    content: string;
    image: string;
    likes: Types.ObjectId[];
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        content: {
            type: String,
            default: "",
            maxlength: 500,
        },
        image: {
            type: String,
            default: ""
        },
        likes: [{
            type: Schema.Types.ObjectId, 
            ref: "User"
        }],
        comments: [{
            user: { type: Schema.Types.ObjectId, ref: "User", required: true },
            text: { type: String, required: true, trim: true },
            createdAt: { type: Date, default: Date.now }
        }]
    },
    {
        timestamps: true
    }
)

PostSchema.index({ author: 1, createdAt: -1 });

const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;