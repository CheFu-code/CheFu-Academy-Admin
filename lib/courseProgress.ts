export const getCompletedChapterSet = (completedChapter?: string[]) =>
    new Set((completedChapter || []).map(String));

export const isCourseFullyCompleted = (
    totalChapters: number,
    completedChapter?: string[],
) => {
    if (totalChapters <= 0) return false;

    const completedChapterSet = getCompletedChapterSet(completedChapter);
    return Array.from({ length: totalChapters }).every((_, index) =>
        completedChapterSet.has(index.toString()),
    );
};

export const getNextRequiredChapterIndex = (
    totalChapters: number,
    completedChapter?: string[],
) => {
    if (totalChapters <= 0) return -1;

    const completedChapterSet = getCompletedChapterSet(completedChapter);
    const nextIndex = Array.from({ length: totalChapters }).findIndex(
        (_, index) => !completedChapterSet.has(index.toString()),
    );

    return nextIndex === -1 ? totalChapters - 1 : nextIndex;
};
