import Link from "next/link";

import Card from "../Card";
import Sidebar from "../Sidebar";
import sortDatesDescending from "@/utils/sortDatesDescending";
import { allPosts } from "contentlayer/generated";

//import Category from "../Category";

const PostListSection = ({ category }: { category?: string }) => {
  return (
    <section className="flex w-full max-w-[1024px] relative justify-center mx-auto gap-4 p-4 py-16">

      <div className="w-full flex flex-col gap-8">
        <h2 className=" font-black text-textColor text-5xl">
          {category ?? "All"}
          <span className="text-primary text-center items-center justify-center text-[5rem] leading-[0]">
            .
          </span>
        </h2> 
        <span>{allPosts.length + " posts."}</span>
        <div className="flex flex-col gap-8 w-full h-fit">
          {sortDatesDescending(allPosts)
            .filter((post) => post.category === category || !category)
            .map((post) => (
              <Link key={post._id} href={post.slug}>
                <Card
                  title={post.title}
                  subtitle={post.subtitle}
                  quote={post.quote}
                  description={post.description}
                  thumbnail={post.thumbnail}
                  category={post.category}
                  date={post.date}
                />
              </Link>
            ))}
        </div>
      </div>

      <div className="w-64 h-fit sticky top-16 hidden desktop:flex shrink-0">
        <Sidebar />
      </div>

    </section>
  );
};

export default PostListSection;
