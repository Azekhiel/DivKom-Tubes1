import { GraphQLClient } from "graphql-request";

export function request({ query, variables }: any) {
  const headers: any = {
    authorization: `Bearer ${process.env.NEXT_DATOCMS_API_TOKEN}`,
  };
  const client = new GraphQLClient("https://graphql.datocms.com", { headers });
  return client.request(query, variables);
}


// Query buat ambil data
export const ALL_CONTENT_QUERY = `
query AllContent {
  allArticles(first: 100) {
    id
    title
    slug
    date
    coverImage {
      url
    }
    tags {
      title
    }
    content {
      value
    }
  }
}
`;

// Query buat ambil artikel berdasarkan Tag spesifik
export const POSTS_BY_TAG_QUERY = `
query PostsByTag($tag: String) {
  allArticles(filter: {tags: {any: {title: {eq: $tag}}}}, orderBy: date_DESC) {
    id
    title
    slug
    date
    coverImage {
      url
    }
    tags {
      title
    }
  }
}
`;