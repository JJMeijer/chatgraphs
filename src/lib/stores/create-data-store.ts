import { create } from "zustand";

import { getSecondRoundedTo, initMinutesData, initSecondsData, uptimeTick } from "@lib/utility";
import { BadgeData, DataPoint, DataStore } from "@types";
import { BadgeFactory } from "@lib/BadgeFactory";
import { EmoteFactory } from "@lib/EmoteFactory";
import { CLEARCHAT } from "@constants";

/**
 * Data structure that is used by the charts.
 * In general, each visualization has a queue for new data that is processed in intervals
 *
 * this is to not overload the react UI with too many renders
 */
export const createDataStore = (badgeFactory: BadgeFactory, emoteFactory: EmoteFactory) => {
    return create<DataStore>((set) => ({
        // Init, intervals & close
        intervals: [],
        init: () =>
            set((state) => {
                // Init Intervals
                state.totalMessagesInit();
                state.uptimeInit();
                state.chattersInit();
                state.totalEmotesInit();
                state.messagesPerSecondInit();
                state.messagesPerMinuteInit();
                state.emotesPerMessageInit();
                state.subscriberPercentageInit();
                state.viewerParticipationInit();
                state.subscriptionsInit();
                state.moderationInit();

                // Init Initial Data
                return {
                    ...state,
                    messagesPerMinute: initMinutesData(30, 1),
                    messagesPerSecond: initSecondsData(300, 1),
                    viewersHistory: initMinutesData(30, 1),
                    emotesPerMessage: initSecondsData(30, 10),
                    subscriberPercentage: initSecondsData(30, 10),
                    viewerParticipation: initMinutesData(30, 1),
                    subscriptions: initMinutesData(30, 1),
                    primeSubscriptions: initMinutesData(30, 1),
                    giftedSubscriptions: initMinutesData(30, 1),
                    bans: initMinutesData(30, 1),
                    timeouts: initMinutesData(30, 1),
                    msgRemovals: initMinutesData(30, 1),
                };
            }),
        close: () =>
            set((state) => {
                state.intervals.forEach((interval) => clearInterval(interval));

                return {
                    ...state,
                    intervals: [],
                };
            }),

        // Message Receiver & distributor
        addMessage: (privMsg) =>
            set((state) => {
                state.addChatMessage(privMsg);

                return {
                    totalMessagesQueue: [...state.totalMessagesQueue, privMsg],
                    chattersQueue: [...state.chattersQueue, privMsg.source],
                    messagesPerSecondQueue: [...state.messagesPerSecondQueue, privMsg],
                    messagesPerMinuteQueue: [...state.messagesPerMinuteQueue, privMsg],
                    emotesPerMessageMsgQueue: [...state.emotesPerMessageMsgQueue, privMsg],
                    subscriberPercentageQueue: [...state.subscriberPercentageQueue, privMsg],
                    viewerParticipationQueue: [...state.viewerParticipationQueue, privMsg],
                };
            }),

        // Emote Receiver & distributor
        addEmote: (emote) =>
            set((state) => ({
                totalEmotesQueue: [...state.totalEmotesQueue, emote],
                emotesPerMessageEmoteQueue: [...state.emotesPerMessageEmoteQueue, emote],
            })),

        // Usernotice Receiver & distributor
        addUsernotice: (usernotice) =>
            set((state) => ({
                subscriptionsQueue: [...state.subscriptionsQueue, usernotice],
            })),

        addClearChat: (clearChat) =>
            set((state) => ({
                moderationQueue: [...state.moderationQueue, clearChat],
            })),

        addClearMsg: (clearMsg) =>
            set((state) => ({
                moderationQueue: [...state.moderationQueue, clearMsg],
            })),

        // Chat Messages
        chatMessages: [],
        addChatMessage: (privMsg) => {
            const {
                tags: { badges = "", emotes = "" },
                content,
            } = privMsg;

            // Parse Badges
            const badgeData = badges
                .split(",")
                .filter((badge) => badge !== "")
                .map((badge) => {
                    return badgeFactory.getBadgeData(badge) || null;
                })
                .filter((badge) => badge !== null) as BadgeData[];

            // Generate message HTML
            const contentHTML = emoteFactory.emotify(content, emotes);

            const parsedPrivMsg = {
                ...privMsg,
                badges: badgeData,
                contentHTML,
            };

            set((state) => ({
                chatMessages: [parsedPrivMsg, ...state.chatMessages],
            }));
        },

        // Uptime Counter
        uptime: "00:00:00",
        uptimeInit: () =>
            set((state) => ({
                intervals: [
                    ...state.intervals,
                    setInterval(() => {
                        set((state) => ({ uptime: uptimeTick(state.uptime) }));
                    }, 1000),
                ],
            })),

        // Total Messages Counter
        totalMessages: 0,
        totalMessagesQueue: [],
        totalMessagesInit: () =>
            set((state) => ({
                intervals: [
                    ...state.intervals,
                    setInterval(() => {
                        set((state) => ({
                            totalMessages: state.totalMessages + state.totalMessagesQueue.length,
                            totalMessagesQueue: [],
                        }));
                    }, 1000),
                ],
            })),

        // Viewer Counter
        viewers: 0,
        viewersHistory: [],
        setViewers: (viewers) =>
            set((state) => {
                const newSecond = new Date().setMilliseconds(0);

                const viewersHistory = [...state.viewersHistory, { x: newSecond, y: viewers }];

                while (viewersHistory[0] && viewersHistory[0].x < newSecond - 30 * 60000) {
                    viewersHistory.shift();
                }

                return { viewers, viewersHistory };
            }),

        // Chatters Counter
        chatters: [],
        chattersQueue: [],
        chattersInit: () =>
            set((state) => ({
                intervals: [
                    ...state.intervals,
                    setInterval(() => {
                        set((state) => {
                            const newChatters = new Set(state.chattersQueue);
                            newChatters.forEach((chatter) => {
                                if (!state.chatters.includes(chatter)) {
                                    state.chatters.push(chatter);
                                }
                            });

                            return {
                                chatters: [...state.chatters],
                                chattersQueue: [],
                            };
                        });
                    }, 1000),
                ],
            })),

        // Total Emotes Counter
        totalEmotes: 0,
        totalEmotesQueue: [],
        totalEmotesInit: () =>
            set((state) => ({
                intervals: [
                    ...state.intervals,
                    setInterval(() => {
                        set((state) => ({
                            totalEmotes: state.totalEmotes + state.totalEmotesQueue.length,
                            totalEmotesQueue: [],
                        }));
                    }, 1000),
                ],
            })),

        // Messages per Second Chart
        messagesPerSecond: [],
        messagesPerSecondQueue: [],
        messagesPerSecondInit: () =>
            set((state) => ({
                intervals: [
                    ...state.intervals,
                    setInterval(() => {
                        set((state) => ({
                            messagesPerSecond: [
                                ...state.messagesPerSecond.slice(1),
                                {
                                    x: new Date().setMilliseconds(0),
                                    y: state.messagesPerSecondQueue.length,
                                },
                            ],
                            messagesPerSecondQueue: [],
                        }));
                    }, 1000),
                ],
            })),

        // Messages per Minute Chart
        messagesPerMinute: [],
        messagesPerMinuteQueue: [],
        messagesPerMinuteInit: () =>
            set((state) => ({
                intervals: [
                    ...state.intervals,
                    setInterval(() => {
                        set((state) => {
                            const newMinute = new Date().setSeconds(0, 0);
                            const newMessages = state.messagesPerMinuteQueue;
                            const minuteIndex = state.messagesPerMinute.findIndex((dataPoint) => dataPoint.x === newMinute);

                            return {
                                messagesPerMinute:
                                    minuteIndex === -1
                                        ? [
                                              ...state.messagesPerMinute.slice(1),
                                              {
                                                  x: newMinute,
                                                  y: newMessages.length,
                                              },
                                          ]
                                        : [
                                              ...state.messagesPerMinute.slice(0, minuteIndex),
                                              {
                                                  x: newMinute,
                                                  y:
                                                      (state.messagesPerMinute[minuteIndex] as DataPoint).y +
                                                      newMessages.length,
                                              },
                                              ...state.messagesPerMinute.slice(minuteIndex + 1),
                                          ],
                                messagesPerMinuteQueue: [],
                            };
                        });
                    }, 2000),
                ],
            })),

        // Emotes per Message Chart
        emotesPerMessage: [],
        emotesPerMessageEmoteQueue: [],
        emotesPerMessageMsgQueue: [],
        emotesPerMessageInit: () =>
            set((state) => ({
                intervals: [
                    ...state.intervals,
                    setInterval(() => {
                        set((state) => {
                            const newSecond = getSecondRoundedTo(10);

                            const newEmotes = state.emotesPerMessageEmoteQueue;
                            const totalWords = state.emotesPerMessageMsgQueue.reduce(
                                (total, msg) => total + msg.content.split(" ").length,
                                0,
                            );

                            return {
                                emotesPerMessage: [
                                    ...state.emotesPerMessage.slice(1),
                                    {
                                        x: newSecond,
                                        y: totalWords === 0 ? 0 : newEmotes.length / totalWords,
                                    },
                                ],
                                emotesPerMessageEmoteQueue: [],
                                emotesPerMessageMsgQueue: [],
                            };
                        });
                    }, 10000),
                ],
            })),

        // Subscribers percentage Chart
        subscriberPercentage: [],
        subscriberPercentageQueue: [],
        subscriberPercentageInit: () =>
            set((state) => ({
                intervals: [
                    ...state.intervals,
                    setInterval(() => {
                        set((state) => {
                            const newSecond = getSecondRoundedTo(10);

                            const totalMessages = state.subscriberPercentageQueue.length;
                            const subscriberMessages = state.subscriberPercentageQueue.filter(
                                (msg) => msg.tags?.["subscriber"] === "1",
                            ).length;

                            return {
                                subscriberPercentage: [
                                    ...state.subscriberPercentage.slice(1),
                                    {
                                        x: newSecond,
                                        y: totalMessages === 0 ? 0 : subscriberMessages / totalMessages,
                                    },
                                ],
                                subscriberPercentageQueue: [],
                            };
                        });
                    }, 10000),
                ],
            })),

        // Viewer participation chart
        viewerParticipation: [],
        viewerParticipationQueue: [],
        viewerParticipationInit: () =>
            set((state) => ({
                intervals: [
                    ...state.intervals,
                    setInterval(() => {
                        set((state) => {
                            const newMinute = new Date().setSeconds(0, 0);
                            const newChatters = new Set(state.viewerParticipationQueue.map((msg) => msg.source)).size;

                            return {
                                viewerParticipation: [
                                    ...state.viewerParticipation.slice(1),
                                    {
                                        x: newMinute,
                                        y: state.viewers === 0 ? 0 : newChatters / state.viewers,
                                    },
                                ],
                                viewerParticipationQueue: [],
                            };
                        });
                    }, 60000),
                ],
            })),

        // Subscriptions Chart
        subscriptions: [],
        primeSubscriptions: [],
        giftedSubscriptions: [],
        subscriptionsQueue: [],
        subscriptionsInit: () =>
            set((state) => ({
                intervals: [
                    ...state.intervals,
                    setInterval(() => {
                        set((state) => {
                            const newMinute = new Date().setSeconds(0, 0);
                            const minuteIndex = state.subscriptions.findIndex((dataPoint) => dataPoint.x === newMinute);

                            let newSubscriptions = 0;
                            let newPrimeSubscriptions = 0;
                            let newGiftedSubscriptions = 0;

                            state.subscriptionsQueue.forEach((msg) => {
                                const msgId = msg.tags?.["msg-id"] || "";
                                if (msgId.match(/^(sub|resub)$/) !== null) {
                                    if (msg.tags?.["msg-param-sub-plan"] !== "Prime") {
                                        newSubscriptions++;
                                    } else {
                                        newPrimeSubscriptions++;
                                    }
                                }

                                if (msgId.match(/^(subgift|submysterygift)$/) !== null) {
                                    newGiftedSubscriptions++;
                                }
                            });

                            if (minuteIndex !== -1) {
                                return {
                                    subscriptions: [
                                        ...state.subscriptions.slice(0, minuteIndex),
                                        {
                                            x: newMinute,
                                            y: (state.subscriptions[minuteIndex] as DataPoint).y + newSubscriptions,
                                        },
                                        ...state.subscriptions.slice(minuteIndex + 1),
                                    ],
                                    primeSubscriptions: [
                                        ...state.primeSubscriptions.slice(0, minuteIndex),
                                        {
                                            x: newMinute,
                                            y:
                                                (state.primeSubscriptions[minuteIndex] as DataPoint).y +
                                                newPrimeSubscriptions,
                                        },
                                        ...state.primeSubscriptions.slice(minuteIndex + 1),
                                    ],
                                    giftedSubscriptions: [
                                        ...state.giftedSubscriptions.slice(0, minuteIndex),
                                        {
                                            x: newMinute,
                                            y:
                                                (state.giftedSubscriptions[minuteIndex] as DataPoint).y +
                                                newGiftedSubscriptions,
                                        },
                                        ...state.giftedSubscriptions.slice(minuteIndex + 1),
                                    ],
                                };
                            }

                            return {
                                subscriptions: [
                                    ...state.subscriptions.slice(1),
                                    {
                                        x: newMinute,
                                        y: newSubscriptions,
                                    },
                                ],
                                primeSubscriptions: [
                                    ...state.primeSubscriptions.slice(1),
                                    {
                                        x: newMinute,
                                        y: newPrimeSubscriptions,
                                    },
                                ],
                                giftedSubscriptions: [
                                    ...state.giftedSubscriptions.slice(1),
                                    {
                                        x: newMinute,
                                        y: newGiftedSubscriptions,
                                    },
                                ],
                                subscriptionsQueue: [],
                            };
                        });
                    }, 5000),
                ],
            })),

        // Moderation Chart
        bans: [],
        timeouts: [],
        msgRemovals: [],
        moderationQueue: [],
        moderationInit: () =>
            set((state) => ({
                intervals: [
                    ...state.intervals,
                    setInterval(() => {
                        set((state) => {
                            const newMinute = new Date().setSeconds(0, 0);
                            const minuteIndex = state.bans.findIndex((dataPoint) => dataPoint.x === newMinute);

                            let newBans = 0;
                            let newTimeouts = 0;
                            let newMsgRemovals = 0;

                            state.moderationQueue.forEach((msg) => {
                                const {
                                    keyword,
                                    tags: { "ban-duration": banDuration },
                                } = msg;

                                if (keyword === CLEARCHAT) {
                                    if (banDuration) {
                                        newTimeouts++;
                                        return;
                                    }

                                    newBans++;
                                    return;
                                }

                                newMsgRemovals++;
                            });

                            if (minuteIndex !== -1) {
                                return {
                                    bans: [
                                        ...state.bans.slice(0, minuteIndex),
                                        {
                                            x: newMinute,
                                            y: (state.bans[minuteIndex] as DataPoint).y + newBans,
                                        },
                                        ...state.bans.slice(minuteIndex + 1),
                                    ],
                                    timeouts: [
                                        ...state.timeouts.slice(0, minuteIndex),
                                        {
                                            x: newMinute,
                                            y: (state.timeouts[minuteIndex] as DataPoint).y + newTimeouts,
                                        },
                                        ...state.timeouts.slice(minuteIndex + 1),
                                    ],
                                    msgRemovals: [
                                        ...state.msgRemovals.slice(0, minuteIndex),
                                        {
                                            x: newMinute,
                                            y: (state.msgRemovals[minuteIndex] as DataPoint).y + newMsgRemovals,
                                        },
                                        ...state.msgRemovals.slice(minuteIndex + 1),
                                    ],
                                };
                            }

                            return {
                                bans: [
                                    ...state.bans.slice(1),
                                    {
                                        x: newMinute,
                                        y: newBans,
                                    },
                                ],
                                timeouts: [
                                    ...state.timeouts.slice(1),
                                    {
                                        x: newMinute,
                                        y: newTimeouts,
                                    },
                                ],
                                msgRemovals: [
                                    ...state.msgRemovals.slice(1),
                                    {
                                        x: newMinute,
                                        y: newMsgRemovals,
                                    },
                                ],
                                moderationQueue: [],
                            };
                        });
                    }, 5000),
                ],
            })),
    }));
};
