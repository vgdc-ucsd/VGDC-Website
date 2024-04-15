import { Post, getSortedPostsData } from "@/lib/post";

interface BlogPreviewProps {
  allPostsData: Post[];
}



export default function BlogPreview({ allPostsData }: BlogPreviewProps) {
    return (
        <ul >
            {allPostsData.map(({ id, date, title }: { id: any, date: any, title: any }) => (
                <li key={id}>
                    {title}
                    <br />
                    {id}
                    <br />
                    {date}
                </li>
            ))}
        </ul>
    )
}

export async function getStaticProps() {
    console.log('getStaticProps is running');

    const allPostsData = getSortedPostsData();
    return {
        props: {
            allPostsData,
        },
    };
}