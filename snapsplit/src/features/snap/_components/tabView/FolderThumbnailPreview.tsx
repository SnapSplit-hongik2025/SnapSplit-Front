export default function FolderThumbnailPreview() {
    return (
      <div className="grid grid-cols-2 gap-1 aspect-square bg-grey-150 rounded-lg p-1">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-grey-350 rounded-md aspect-square w-full"
          />
        ))}
      </div>
    );
}
  