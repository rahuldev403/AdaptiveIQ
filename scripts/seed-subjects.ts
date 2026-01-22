import { MongoClient, ObjectId } from "mongodb";
import { Subject } from "@/lib/db/schema";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local or .env
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI environment variable is not set");
  console.log("\n📝 Please create a .env.local or .env file with:");
  console.log("   MONGODB_URI=mongodb://localhost:27017/adaptiq");
  console.log("   or");
  console.log(
    "   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/adaptiq",
  );
  process.exit(1);
}

const subjects: Omit<Subject, "_id">[] = [
  {
    title: "React Fundamentals",
    description:
      "Core React concepts including components, hooks, and state management",
    icon: "react",
    category: "Frontend",
    questions: [
      {
        question: "What is the purpose of the useState hook in React?",
        options: [
          "To fetch data from an API",
          "To manage component state",
          "To handle side effects",
          "To optimize performance",
        ],
        correct_answer: 1,
        explanation:
          "useState is a React Hook that lets you add state to functional components.",
        difficulty: "Easy",
      },
      {
        question: "What does the useEffect hook do?",
        options: [
          "Manages state in components",
          "Performs side effects in components",
          "Creates context providers",
          "Handles routing",
        ],
        correct_answer: 1,
        explanation:
          "useEffect allows you to perform side effects in function components like data fetching, subscriptions, or manually changing the DOM.",
        difficulty: "Easy",
      },
      {
        question: "What is JSX?",
        options: [
          "A JavaScript framework",
          "A syntax extension for JavaScript",
          "A CSS preprocessor",
          "A build tool",
        ],
        correct_answer: 1,
        explanation:
          "JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file.",
        difficulty: "Easy",
      },
      {
        question: "How do you pass data from parent to child component?",
        options: ["Using state", "Using props", "Using context", "Using refs"],
        correct_answer: 1,
        explanation:
          "Props (properties) are used to pass data from parent components to child components.",
        difficulty: "Easy",
      },
      {
        question: "What is the virtual DOM?",
        options: [
          "A copy of the real DOM kept in memory",
          "A new browser API",
          "A CSS framework",
          "A testing library",
        ],
        correct_answer: 0,
        explanation:
          "The virtual DOM is a lightweight copy of the real DOM that React uses to optimize updates and improve performance.",
        difficulty: "Medium",
      },
      {
        question: "What is prop drilling?",
        options: [
          "A performance optimization technique",
          "Passing props through multiple nested components",
          "A type of component lifecycle method",
          "A testing strategy",
        ],
        correct_answer: 1,
        explanation:
          "Prop drilling is the process of passing data from a parent component to deeply nested child components through all intermediate components.",
        difficulty: "Medium",
      },
      {
        question: "What is the Context API used for?",
        options: [
          "Routing between pages",
          "Managing global state without prop drilling",
          "Handling form validation",
          "Optimizing performance",
        ],
        correct_answer: 1,
        explanation:
          "Context API provides a way to share values between components without having to explicitly pass props through every level of the tree.",
        difficulty: "Medium",
      },
      {
        question:
          "What is the difference between controlled and uncontrolled components?",
        options: [
          "Controlled components use state, uncontrolled use refs",
          "Controlled components are faster",
          "There is no difference",
          "Uncontrolled components use state",
        ],
        correct_answer: 0,
        explanation:
          "Controlled components have their form data handled by React state, while uncontrolled components store their data in the DOM itself, accessed via refs.",
        difficulty: "Medium",
      },
      {
        question: "What is React.memo()?",
        options: [
          "A hook for storing values",
          "A higher-order component that prevents unnecessary re-renders",
          "A function to create context",
          "A routing function",
        ],
        correct_answer: 1,
        explanation:
          "React.memo() is a higher order component that memoizes the component, preventing re-renders if props haven't changed.",
        difficulty: "Medium",
      },
      {
        question: "What is the purpose of the key prop in lists?",
        options: [
          "To style elements",
          "To help React identify which items have changed",
          "To pass data to components",
          "To trigger re-renders",
        ],
        correct_answer: 1,
        explanation:
          "Keys help React identify which items in a list have changed, been added, or removed, optimizing the reconciliation process.",
        difficulty: "Medium",
      },
      {
        question: "What are React fragments?",
        options: [
          "Deprecated features",
          "A way to group multiple elements without adding extra DOM nodes",
          "Performance optimization tools",
          "Component lifecycle methods",
        ],
        correct_answer: 1,
        explanation:
          "Fragments let you group a list of children without adding extra nodes to the DOM.",
        difficulty: "Easy",
      },
      {
        question: "What is the useCallback hook used for?",
        options: [
          "Managing state",
          "Memoizing callback functions",
          "Handling side effects",
          "Creating context",
        ],
        correct_answer: 1,
        explanation:
          "useCallback returns a memoized callback function that only changes if one of the dependencies has changed, preventing unnecessary re-renders.",
        difficulty: "Hard",
      },
      {
        question: "What is the useMemo hook?",
        options: [
          "For managing state",
          "For memoizing expensive calculations",
          "For handling effects",
          "For creating refs",
        ],
        correct_answer: 1,
        explanation:
          "useMemo returns a memoized value, only recomputing when dependencies change, optimizing expensive calculations.",
        difficulty: "Hard",
      },
      {
        question: "What is hydration in React?",
        options: [
          "Adding water to components",
          "Attaching event listeners to server-rendered HTML",
          "A state management technique",
          "A routing method",
        ],
        correct_answer: 1,
        explanation:
          "Hydration is the process of attaching event listeners and React state to server-rendered HTML to make it interactive.",
        difficulty: "Hard",
      },
      {
        question: "What is React Suspense?",
        options: [
          "A state management library",
          "A component that lets you display a fallback while waiting for content to load",
          "A routing solution",
          "A testing utility",
        ],
        correct_answer: 1,
        explanation:
          "Suspense is a React component that lets you specify loading states for parts of the component tree that are not yet ready to render.",
        difficulty: "Hard",
      },
    ],
    created_at: new Date(),
  },
  {
    title: "Next.js App Router",
    description:
      "Master Next.js 15 App Router with server components and routing",
    icon: "triangle",
    category: "Frontend",
    questions: [
      {
        question:
          "What is the default rendering mode for components in Next.js App Router?",
        options: [
          "Client components",
          "Server components",
          "Static components",
          "Dynamic components",
        ],
        correct_answer: 1,
        explanation:
          "In Next.js App Router, all components are Server Components by default unless marked with 'use client'.",
        difficulty: "Easy",
      },
      {
        question: "How do you create a client component in Next.js 15?",
        options: [
          "Use 'use client' directive at the top of the file",
          "Import from 'next/client'",
          "Set client: true in config",
          "Use .client.tsx extension",
        ],
        correct_answer: 0,
        explanation:
          "You mark a component as a Client Component by adding 'use client' directive at the top of the file.",
        difficulty: "Easy",
      },
      {
        question: "What is the purpose of the layout.tsx file?",
        options: [
          "To define API routes",
          "To create shared UI for multiple pages",
          "To handle authentication",
          "To configure build settings",
        ],
        correct_answer: 1,
        explanation:
          "layout.tsx creates a shared UI that wraps page components, persisting across route changes.",
        difficulty: "Easy",
      },
      {
        question: "What is the loading.tsx file used for?",
        options: [
          "Loading environment variables",
          "Creating loading UI automatically shown while page loads",
          "Loading external scripts",
          "Database connections",
        ],
        correct_answer: 1,
        explanation:
          "loading.tsx creates instant loading states that are automatically shown while a page's content is loading.",
        difficulty: "Easy",
      },
      {
        question: "How do you create dynamic routes in App Router?",
        options: [
          "Use [param] folder naming",
          "Use :param in filename",
          "Configure in next.config.js",
          "Use query parameters",
        ],
        correct_answer: 0,
        explanation:
          "Dynamic routes are created using square bracket folder names like [id] or [slug].",
        difficulty: "Easy",
      },
      {
        question: "What are Server Actions in Next.js?",
        options: [
          "API routes",
          "Async functions that run on the server",
          "Middleware functions",
          "Build plugins",
        ],
        correct_answer: 1,
        explanation:
          "Server Actions are asynchronous functions that execute on the server, marked with 'use server'.",
        difficulty: "Medium",
      },
      {
        question: "What is the error.tsx file for?",
        options: [
          "Logging errors",
          "Creating error boundaries for route segments",
          "Handling 404s",
          "Development debugging",
        ],
        correct_answer: 1,
        explanation:
          "error.tsx creates error boundaries that catch errors in route segments and display fallback UI.",
        difficulty: "Medium",
      },
      {
        question: "How do you access route parameters in a page component?",
        options: [
          "Through the params prop",
          "Using useParams hook",
          "From window.location",
          "Through searchParams only",
        ],
        correct_answer: 0,
        explanation:
          "Page components receive params as a prop, containing the dynamic route parameters.",
        difficulty: "Medium",
      },
      {
        question: "What is the template.tsx file?",
        options: [
          "Same as layout.tsx",
          "Similar to layout but creates new instance on navigation",
          "For page templates only",
          "For email templates",
        ],
        correct_answer: 1,
        explanation:
          "template.tsx is similar to layout but creates a new instance on navigation, useful for animations or when state shouldn't persist.",
        difficulty: "Hard",
      },
      {
        question: "What is the purpose of route groups in App Router?",
        options: [
          "Grouping API endpoints",
          "Organizing routes without affecting URL structure",
          "Creating protected routes",
          "Optimizing bundle size",
        ],
        correct_answer: 1,
        explanation:
          "Route groups using (folder) syntax organize routes logically without adding segments to the URL path.",
        difficulty: "Hard",
      },
      {
        question:
          "What is the difference between generateStaticParams and getStaticPaths?",
        options: [
          "They are the same",
          "generateStaticParams is for App Router, getStaticPaths for Pages Router",
          "generateStaticParams is deprecated",
          "No difference in functionality",
        ],
        correct_answer: 1,
        explanation:
          "generateStaticParams is the App Router equivalent of Pages Router's getStaticPaths for static generation.",
        difficulty: "Hard",
      },
      {
        question: "What does the not-found.tsx file do?",
        options: [
          "Handles all errors",
          "Creates custom 404 UI for route segments",
          "Redirects to homepage",
          "Logs missing routes",
        ],
        correct_answer: 1,
        explanation:
          "not-found.tsx creates custom UI to show when the notFound() function is triggered or no route matches.",
        difficulty: "Medium",
      },
      {
        question: "How do you make a route segment dynamic vs static?",
        options: [
          "Next.js automatically determines it",
          "Use 'use client' directive",
          "Configure in route segment config (force-dynamic, force-static)",
          "Use getServerSideProps",
        ],
        correct_answer: 2,
        explanation:
          "Route segment config options like export const dynamic = 'force-dynamic' control rendering behavior.",
        difficulty: "Hard",
      },
      {
        question: "What are parallel routes in Next.js?",
        options: [
          "Routes that load simultaneously in the same layout using @folder slots",
          "API routes that run in parallel",
          "Multiple pages at same URL",
          "Optimized route loading",
        ],
        correct_answer: 0,
        explanation:
          "Parallel routes allow you to render multiple pages in the same layout simultaneously using named slots (@folder).",
        difficulty: "Hard",
      },
      {
        question: "What is the default.tsx file used for?",
        options: [
          "Default export for components",
          "Fallback UI for parallel routes",
          "Default page content",
          "Error fallback",
        ],
        correct_answer: 1,
        explanation:
          "default.tsx provides fallback content for parallel route slots when no matching route is found.",
        difficulty: "Hard",
      },
    ],
    created_at: new Date(),
  },
  {
    title: "TypeScript Essentials",
    description:
      "Type safety, interfaces, generics, and advanced TypeScript patterns",
    icon: "code",
    category: "Languages",
    questions: [
      {
        question:
          "What is the difference between 'interface' and 'type' in TypeScript?",
        options: [
          "No difference",
          "Interfaces can be extended, types cannot",
          "Interfaces can extend and be extended, types use intersection",
          "Types are deprecated",
        ],
        correct_answer: 2,
        explanation:
          "Both can describe object shapes, but interfaces can extend other interfaces using 'extends', while types use intersection (&) and can represent unions, primitives, and more.",
        difficulty: "Medium",
      },
      {
        question: "What does the 'unknown' type represent?",
        options: [
          "Same as 'any'",
          "A type-safe version of 'any' requiring type checking before use",
          "Undefined values only",
          "Null values only",
        ],
        correct_answer: 1,
        explanation:
          "unknown is type-safe alternative to any - you must narrow the type before using it, preventing runtime errors.",
        difficulty: "Medium",
      },
      {
        question: "What is a generic in TypeScript?",
        options: [
          "A base class",
          "A type variable that makes components work with multiple types",
          "A design pattern",
          "An error handler",
        ],
        correct_answer: 1,
        explanation:
          "Generics allow you to create reusable components that work with multiple types while maintaining type safety.",
        difficulty: "Medium",
      },
      {
        question: "What is the 'never' type used for?",
        options: [
          "Optional values",
          "Values that never occur (functions that throw or infinite loops)",
          "Null values",
          "Empty arrays",
        ],
        correct_answer: 1,
        explanation:
          "never represents values that never occur, used for functions that never return (throw errors or infinite loops) or for exhaustive type checking.",
        difficulty: "Hard",
      },
      {
        question: "What is type narrowing?",
        options: [
          "Making types smaller",
          "Refining a variable's type within a conditional block",
          "Compressing type definitions",
          "Removing type information",
        ],
        correct_answer: 1,
        explanation:
          "Type narrowing is the process of refining a variable's type to a more specific type within a conditional block using type guards.",
        difficulty: "Medium",
      },
      {
        question: "What is the purpose of the 'readonly' modifier?",
        options: [
          "Makes variables constant",
          "Prevents reassignment of properties after initialization",
          "Optimizes performance",
          "Enables caching",
        ],
        correct_answer: 1,
        explanation:
          "readonly modifier makes properties immutable after initialization, preventing accidental modifications.",
        difficulty: "Easy",
      },
      {
        question: "What are utility types?",
        options: [
          "Helper functions",
          "Built-in type transformations like Partial<T>, Required<T>",
          "Development tools",
          "Testing utilities",
        ],
        correct_answer: 1,
        explanation:
          "Utility types are built-in TypeScript types that facilitate common type transformations like Partial, Pick, Omit, Record, etc.",
        difficulty: "Medium",
      },
      {
        question:
          "What is the difference between 'as const' and regular const?",
        options: [
          "No difference",
          "'as const' creates literal types and readonly arrays/objects",
          "'as const' is deprecated",
          "Only works with numbers",
        ],
        correct_answer: 1,
        explanation:
          "'as const' creates a deeply readonly literal type, making all properties readonly and narrowing to literal types.",
        difficulty: "Hard",
      },
      {
        question: "What is a discriminated union?",
        options: [
          "A union type with a common literal property for type narrowing",
          "A database operation",
          "A design pattern",
          "A testing strategy",
        ],
        correct_answer: 0,
        explanation:
          "Discriminated unions use a common literal property (discriminant) to distinguish between union members, enabling type narrowing.",
        difficulty: "Hard",
      },
      {
        question: "What is the 'keyof' operator?",
        options: [
          "Creates object keys",
          "Produces a union of an object type's keys",
          "Deletes keys",
          "Sorts keys",
        ],
        correct_answer: 1,
        explanation:
          "keyof operator produces a string or numeric literal union of an object type's keys.",
        difficulty: "Medium",
      },
      {
        question: "What is the 'typeof' operator in TypeScript?",
        options: [
          "Same as JavaScript typeof",
          "Extracts the type of a value for type definitions",
          "Type checking function",
          "Error handler",
        ],
        correct_answer: 1,
        explanation:
          "In type contexts, typeof extracts the static type of a value, useful for creating types from runtime values.",
        difficulty: "Medium",
      },
      {
        question: "What are conditional types?",
        options: [
          "If statements in code",
          "Types that select based on a condition (T extends U ? X : Y)",
          "Optional types",
          "Dynamic types",
        ],
        correct_answer: 1,
        explanation:
          "Conditional types allow type relationships that express logic, selecting between two possible types based on a condition.",
        difficulty: "Hard",
      },
      {
        question: "What is mapped type?",
        options: [
          "Array map method",
          "Type that transforms properties of another type",
          "Geographic data type",
          "Collection type",
        ],
        correct_answer: 1,
        explanation:
          "Mapped types transform each property of an existing type, like making all properties optional or readonly.",
        difficulty: "Hard",
      },
      {
        question: "What is the 'infer' keyword?",
        options: [
          "Type inference",
          "Introduces type variable in conditional type's true branch",
          "Automatic typing",
          "Error inference",
        ],
        correct_answer: 1,
        explanation:
          "infer keyword is used within conditional types to infer (extract) a type from another type being examined.",
        difficulty: "Hard",
      },
      {
        question: "What is type assertion vs type casting?",
        options: [
          "They are the same",
          "TypeScript has assertions (as), not casting; it's compile-time only",
          "Casting is safer",
          "Assertions change runtime behavior",
        ],
        correct_answer: 1,
        explanation:
          "TypeScript uses type assertions (as) which are compile-time only and don't affect runtime, unlike traditional casting in other languages.",
        difficulty: "Medium",
      },
    ],
    created_at: new Date(),
  },
  {
    title: "MongoDB Database",
    description: "NoSQL database operations, aggregation, and data modeling",
    icon: "database",
    category: "Backend",
    questions: [
      {
        question: "What type of database is MongoDB?",
        options: [
          "Relational database",
          "Document-oriented NoSQL database",
          "Graph database",
          "Key-value store",
        ],
        correct_answer: 1,
        explanation:
          "MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like documents.",
        difficulty: "Easy",
      },
      {
        question: "What format does MongoDB use to store data?",
        options: ["JSON", "BSON (Binary JSON)", "XML", "CSV"],
        correct_answer: 1,
        explanation:
          "MongoDB uses BSON (Binary JSON) format, which extends JSON with additional data types and is more efficient for storage.",
        difficulty: "Easy",
      },
      {
        question: "What is a collection in MongoDB?",
        options: [
          "A group of databases",
          "A group of documents, equivalent to a table in relational databases",
          "A backup file",
          "An index",
        ],
        correct_answer: 1,
        explanation:
          "A collection is a grouping of MongoDB documents, analogous to a table in relational databases.",
        difficulty: "Easy",
      },
      {
        question: "What is the default port for MongoDB?",
        options: ["3306", "5432", "27017", "8080"],
        correct_answer: 2,
        explanation: "MongoDB's default port is 27017.",
        difficulty: "Easy",
      },
      {
        question: "What is the _id field in MongoDB?",
        options: [
          "Optional field",
          "Unique identifier automatically created for each document",
          "User-defined field",
          "Index name",
        ],
        correct_answer: 1,
        explanation:
          "_id is a required field that acts as the primary key. If not provided, MongoDB automatically generates an ObjectId for it.",
        difficulty: "Easy",
      },
      {
        question: "What is the MongoDB aggregation framework?",
        options: [
          "Data backup tool",
          "Pipeline for processing and transforming documents",
          "Query language",
          "Replication system",
        ],
        correct_answer: 1,
        explanation:
          "The aggregation framework provides a pipeline of stages that process and transform documents, similar to SQL GROUP BY operations.",
        difficulty: "Medium",
      },
      {
        question: "What does the $match stage do in aggregation?",
        options: [
          "Creates indexes",
          "Filters documents to pass only matching documents to next stage",
          "Joins collections",
          "Sorts results",
        ],
        correct_answer: 1,
        explanation:
          "$match filters documents based on specified conditions, similar to WHERE clause in SQL.",
        difficulty: "Medium",
      },
      {
        question: "What is an index in MongoDB?",
        options: [
          "A document counter",
          "Data structure that improves query performance",
          "Collection name",
          "Database backup",
        ],
        correct_answer: 1,
        explanation:
          "Indexes are data structures that store a small portion of data to improve query performance by reducing document scans.",
        difficulty: "Medium",
      },
      {
        question: "What is a replica set?",
        options: [
          "A backup strategy",
          "Group of MongoDB servers maintaining same data for high availability",
          "Collection copy",
          "Index type",
        ],
        correct_answer: 1,
        explanation:
          "A replica set is a group of MongoDB instances that maintain the same data set, providing redundancy and high availability.",
        difficulty: "Medium",
      },
      {
        question: "What is sharding in MongoDB?",
        options: [
          "Data backup method",
          "Horizontal scaling by distributing data across multiple machines",
          "Vertical scaling",
          "Compression technique",
        ],
        correct_answer: 1,
        explanation:
          "Sharding is a method for distributing data across multiple machines for horizontal scaling of large datasets.",
        difficulty: "Hard",
      },
      {
        question: "What is the $lookup stage used for?",
        options: [
          "Searching text",
          "Performing left outer join between collections",
          "Creating indexes",
          "Deleting documents",
        ],
        correct_answer: 1,
        explanation:
          "$lookup performs a left outer join to another collection in the same database, similar to SQL JOIN.",
        difficulty: "Hard",
      },
      {
        question: "What is an embedded document?",
        options: [
          "External file",
          "Document stored inside another document",
          "Referenced document",
          "Deleted document",
        ],
        correct_answer: 1,
        explanation:
          "An embedded document is a document nested within another document, used for one-to-one or one-to-few relationships.",
        difficulty: "Medium",
      },
      {
        question:
          "What is the difference between embedded and referenced documents?",
        options: [
          "No difference",
          "Embedded stores data inside, referenced stores ObjectId reference to another document",
          "Embedded is deprecated",
          "Referenced is faster",
        ],
        correct_answer: 1,
        explanation:
          "Embedded documents store related data together in one document, while referenced documents store relationships using ObjectId references.",
        difficulty: "Medium",
      },
      {
        question: "What is the $group stage?",
        options: [
          "Groups users",
          "Groups documents by specified expression and applies accumulator expressions",
          "Creates collections",
          "Indexes documents",
        ],
        correct_answer: 1,
        explanation:
          "$group groups documents by a specified identifier and allows you to apply accumulator expressions like sum, avg, count.",
        difficulty: "Hard",
      },
      {
        question: "What is MongoDB Atlas?",
        options: [
          "MongoDB GUI tool",
          "Fully managed cloud database service for MongoDB",
          "Local MongoDB installation",
          "Database visualization tool",
        ],
        correct_answer: 1,
        explanation:
          "MongoDB Atlas is a fully managed cloud database service that handles deployment, scaling, and maintenance of MongoDB.",
        difficulty: "Easy",
      },
    ],
    created_at: new Date(),
  },
];

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✓ Connected to MongoDB");

    const db = client.db();
    const subjectsCollection = db.collection<Subject>("subjects");

    // Check if subjects already exist
    const existingCount = await subjectsCollection.countDocuments();
    if (existingCount > 0) {
      console.log(
        `⚠ Found ${existingCount} existing subjects. Clearing collection...`,
      );
      await subjectsCollection.deleteMany({});
    }

    // Insert subjects
    const result = await subjectsCollection.insertMany(subjects as any);
    console.log(`✓ Inserted ${result.insertedCount} subjects`);

    // Create indexes
    await subjectsCollection.createIndex({ category: 1 });
    await subjectsCollection.createIndex({ title: 1 });
    console.log("✓ Created indexes");

    // Print summary
    const categories = [...new Set(subjects.map((s) => s.category))];
    console.log("\n📊 Summary:");
    console.log(`   Total subjects: ${subjects.length}`);
    console.log(`   Categories: ${categories.join(", ")}`);
    console.log(`   Questions per subject: 15`);
    console.log(`   Total questions: ${subjects.length * 15}`);

    console.log("\n✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDatabase();
