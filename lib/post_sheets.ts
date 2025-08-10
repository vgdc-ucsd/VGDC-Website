import { getSheetData } from "./google-sheets.action"

export type Post = {
    id: string
    title: string
    date: string
    author: string
    excerpt: string
    coverImage: string
    coverCredit?: string
    content: string
}

export async function getSortedPostsData(index: number) {
    const response = await getSheetData("Blog")

    let allPostsData = []

    if (response.data != undefined && response.data != null) {
        // Iterate through every event.
        for (let i in response.data) {
            if(response.data[i][0] == "") continue

            let post: Post = {
                id: formatTitleToSlugClean(response.data[i][0]),
                title: response.data[i][0],
                date: response.data[i][1],
                author: response.data[i][2],
                excerpt: response.data[i][3],
                coverImage: response.data[i][4],
                coverCredit: response.data[i][5] === "" ? null : response.data[i][5],
                content: response.data[i][6]
            }

            allPostsData.push(post)
        }
    }

    // Sort posts by date
    const sortedPosts = allPostsData.sort((a, b) => {
        if (a.date < b.date) {
        return 1
        } else {
        return -1
        }
    })

    // Return only the two most recent posts
    return index == 0 ? sortedPosts : sortedPosts.slice(0, index)
}

export async function getPostData(id: string) {
    const response = await getSheetData("Blog")

    if (response.data != undefined && response.data != null) {
        // Iterate through every event.
        for (let i in response.data) {
            if(response.data[i][0] == "") continue

            let ID = formatTitleToSlugClean(response.data[i][0])
            if(ID === id){
                let post: Post = {
                    id: ID,
                    title: response.data[i][0],
                    date: response.data[i][1],
                    author: response.data[i][2],
                    excerpt: response.data[i][3],
                    coverImage: response.data[i][4],
                    coverCredit: response.data[i][5] === "" ? null : response.data[i][5],
                    content: response.data[i][6]
                }

                return post
            }
        }
    }

    // fail to find blog
    return null
}

export async function generateNeighbors(id: string) {
    const sortedPosts = await getSortedPostsData(0)

    // Find the index of the current post
    const currentIndex = sortedPosts.findIndex((post) => post.id === id)

    console.log(sortedPosts.length)
    // Define previous and next posts
    let previousPost = null
    let nextPost = null

    // If current post is not the first post, set previous post
    if (currentIndex > 0) {
        previousPost = sortedPosts[currentIndex - 1]
    }

    // If current post is not the last post, set next post
    if (currentIndex < sortedPosts.length) {
        nextPost = sortedPosts[currentIndex + 1]
    }

    return { previousPost, nextPost }
}
function formatTitleToSlugClean(title: string): string {
  return title
    .replace(/[^a-zA-Z0-9\s]/g, '') // remove non-alphanumeric characters
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-')
}