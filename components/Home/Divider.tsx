export default function Divider() {
    return (
      <div className="divider flex items-center justify-center gap-1 pb-2 dark:bg-black  bg-white px-6">
        <div className="h-6 w-6 rounded-full  bg-shade" />
        <div className="h-6 w-6 rounded-full border-2 border-shade" />
        <div className="h-6 w-6 rounded-full border-2 border-shade" />
        <div className="w-[90%] h-[3px] bg-gradient-to-r from-shade to-primary  pl-5 rounded-md"/>
      </div>
    );
  }
  