import { InstanceStore } from "@types";
import { create } from "zustand";
import { IrcClient, PubSubClient, EventBus, BadgeFactory } from "@lib";
import { createDataStore } from "./create-data-store";
import { EmoteFactory } from "@lib/EmoteFactory";
import { CLEARCHAT, CLEARMSG, EMOTE_USED, PRIVMSG, USERNOTICE, VIEW_COUNT } from "@constants";

const initInstance = () => {
    const eventBus = new EventBus();

    const ircClient = new IrcClient(eventBus);
    const pubSubClient = new PubSubClient(eventBus);
    const badgeFactory = new BadgeFactory(eventBus);
    const emoteFactory = new EmoteFactory(eventBus);

    const useDataStore = createDataStore(badgeFactory, emoteFactory);

    // Bridges between IRC messages from the eventbus and the data store
    eventBus.on(PRIVMSG, (privMsg) => {
        useDataStore.getState().addMessage(privMsg);
    });

    eventBus.on(USERNOTICE, (usernotice) => {
        useDataStore.getState().addUsernotice(usernotice);
    });

    eventBus.on(CLEARCHAT, (clearchat) => {
        useDataStore.getState().addClearChat(clearchat);
    });

    eventBus.on(CLEARMSG, (clearmsg) => {
        useDataStore.getState().addClearMsg(clearmsg);
    });

    // Bridge between PubSub messages from the eventbus and the data store
    eventBus.on(VIEW_COUNT, (viewCount) => {
        useDataStore.getState().setViewers(viewCount.viewers);
    });

    // Bridge Between the emote_used messages from the eventbus and the data store
    eventBus.on(EMOTE_USED, (emote) => {
        useDataStore.getState().addEmote(emote);
    });

    return {
        channel: "",
        id: crypto.randomUUID(),
        eventBus,
        ircClient,
        pubSubClient,
        badgeFactory,
        emoteFactory,
        useDataStore,
    };
};

export const useInstanceStore = create<InstanceStore>((set, get) => {
    const initialInstance = initInstance();

    return {
        instances: [initialInstance],
        activeInstanceId: initialInstance.id,
        setActiveInstanceId: (id) => set(() => ({ activeInstanceId: id })),
        addInstance: () =>
            set((state) => {
                const newInstance = initInstance();

                get().setActiveInstanceId(newInstance.id);

                return { instances: [...state.instances, newInstance] };
            }),
        removeInstance: (id) =>
            set((state) => {
                const instance = state.instances.find((x) => x.id === id);
                if (instance) {
                    instance.eventBus.reset();

                    instance.ircClient.close();
                    instance.pubSubClient.close();

                    instance.useDataStore.getState().close();
                }

                const filteredInstances = state.instances.filter((x) => x.id !== id);

                // When this was the last instance in the list, create a new one
                if (filteredInstances.length === 0) {
                    const newInstance = initInstance();
                    get().setActiveInstanceId(newInstance.id);

                    return { instances: [newInstance] };
                }

                const lastInstance = filteredInstances.slice(-1)[0];
                if (lastInstance) get().setActiveInstanceId(lastInstance.id);

                return { instances: filteredInstances };
            }),
        setInstanceChannel: (id, channel) =>
            set((state) => ({
                instances: state.instances.map((instance) => {
                    if (instance.id === id) {
                        instance.channel = channel;
                        instance.ircClient.join(channel);
                        instance.useDataStore.getState().init();
                    }

                    return instance;
                }),
            })),
    };
});
