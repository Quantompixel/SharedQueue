let queue = [
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

    for (let entry of queue) {
        if (entry.id === song) {
           songToReorder = entry;
        }
    }

    if (!songToReorder) {
        return queue;
    }

    let newQueue = queue.filter(elem => elem.id !== song);

    for (let [index, entry] of newQueue.entries()) {
        if (entry.id === reference) {
            referenceIndex = index;
        }
    }

    if (before) {
        newQueue.splice(referenceIndex, 0, songToReorder);
    } else {
        newQueue.splice(referenceIndex + 1, 0, songToReorder);
    }

    queue = newQueue;

    return newQueue;
}

const removeRequest = (id) => {
    if (id < -1) {
        return queue;
    }

    queue = queue.filter(elem => elem.id !== id);

    return queue;
}

const getQueueRequest = () => {
   return queue;
}

module.exports = {
    reorderRequest,
    getQueueRequest,
    removeRequest
};
