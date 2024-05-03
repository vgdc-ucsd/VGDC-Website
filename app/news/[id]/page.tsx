import { Post, getPostData } from "@/lib/post"
import ReactMarkdown from 'react-markdown'
import { parseISO, format } from 'date-fns';



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
    


// export async function getStaticProps({ params }: {params:any}) {
//     const postData = getPostData(params.id);
//     return {
//       props: {
//         postData,
//       },
//     };
//   }