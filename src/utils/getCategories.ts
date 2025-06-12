import { allPosts } from "contentlayer/generated";

const getCategories = () => Array.from(new Set(allPosts.map((item) => item.category)));
console.log(getCategories)
export default getCategories;
