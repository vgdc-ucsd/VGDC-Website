import { Post, getPostData } from "@/lib/post"
import ReactMarkdown from 'react-markdown'
import { parseISO, format } from 'date-fns';

/**
 * This page holds the content for a 
 * specific blog post. It fetches the id of the 
 * blog from the URL params and then fetches the 
 * file contents using getPostData()
 * 
 * ReactMarkdown is then used to display the 
 * blog content. 
 */

export default async function Page({ params }: { params: { id: string } }) {    
    const post = await getPostData(params.id);
    return (
        <article className="min-h-screen bg-background-black">
            <h1 className="text-3xl font-bold pb-4 text-white">{post.title}</h1>
            <DateFormat dateString={post.date} />

            <ReactMarkdown className="text-text-grey mt-4 max-w-lg text-sm sm:text-base xl:text-lg">{post.content}</ReactMarkdown>
            {/* <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} /> */}
        </article>
    );
}

function DateFormat({dateString}: {dateString: string}) {
    const date = parseISO(dateString);
    return (<time className = "text-white" dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>); 
}
    

