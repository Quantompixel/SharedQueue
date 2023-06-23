const queue = [
    {
        id: 1,
        title: "First Song"
    },
    {
        id: 2,
        title: "Second Song"
    },
    {
        id: 3,
        title: "Third Song"
    },
    {
        id: 4,
        title: "Fourth Song"
    },
    {
        id: 5,
        title: "Fifth Song"
    },
];

const reorderRequest = (song, reference, before) => {
    let songToReorder;
    let referenceIndex;

    for (let [index, entry] of queue.entries()) {
        if (entry.id === song) {
           songToReorder = entry;
        }

        if (entry.id === reference) {
            referenceIndex = index;
        }
    }

    if (!songToReorder || !referenceIndex) {
        return queue;
    }

    let newQueue = queue.filter(elem => elem.id !== song);

    if (before) {
        newQueue.splice(referenceIndex - 1, 0, songToReorder);
    } else {
        newQueue.splice(referenceIndex, 0, songToReorder);
    }

    return newQueue;
}

module.exports = {
    reorderRequest
};
