export type ServiceYear = 2020 | 2021 | 2022;

export enum ServiceEnum {
    Photography = "Photography",
    VideoRecording = "VideoRecording",
    BlurayPackage = "BlurayPackage",
    TwoDayEvent = "TwoDayEvent",
    WeddingSession = "WeddingSession"
}

export type ServiceType = keyof typeof ServiceEnum;

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
): ServiceType[] => {
    switch (action.type) {
        case "Select":
            if (previouslySelectedServices.includes(action.service)) return previouslySelectedServices;
            if (
                action.service === ServiceEnum.BlurayPackage &&
                !previouslySelectedServices.some((service) => service === ServiceEnum.Photography || service === ServiceEnum.VideoRecording)) {
                return previouslySelectedServices;
            }
            return [...previouslySelectedServices, action.service];

        case "Deselect":
            let updatedServices = previouslySelectedServices.filter((service) => service !== action.service);

            if (action.service === ServiceEnum.Photography || action.service === ServiceEnum.VideoRecording) {
                if (
                    !updatedServices.some((service) => service === ServiceEnum.Photography || service === ServiceEnum.VideoRecording)
                ) {
                    updatedServices = updatedServices.filter(
                        (service) => service !== ServiceEnum.BlurayPackage && service !== ServiceEnum.TwoDayEvent
                    );
                }
            }
            return updatedServices;

        default:
            return previouslySelectedServices;
    }
};


export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    const prices = {
        Photography: { 2020: 1700, 2021: 1800, 2022: 1900 },
        VideoRecording: { 2020: 1700, 2021: 1800, 2022: 1900 },
        Combo: { 2020: 2200, 2021: 2300, 2022: 2500 },
        WeddingSession: 600,
        BlurayPackage: 300,
        TwoDayEvent: 400
    };

    let basePrice = 0;
    let finalPrice = 0;

    const hasPhotography = selectedServices.includes(ServiceEnum.Photography);
    const hasVideo = selectedServices.includes(ServiceEnum.VideoRecording);
    const hasBluray = selectedServices.includes(ServiceEnum.BlurayPackage);
    const hasTwoDayEvent = selectedServices.includes(ServiceEnum.TwoDayEvent);
    const hasWeddingSession = selectedServices.includes(ServiceEnum.WeddingSession);

    if (hasPhotography && hasVideo) {
        basePrice += prices.Combo[selectedYear];
        finalPrice += prices.Combo[selectedYear];
    } else {
        if (hasPhotography) {
            basePrice += prices.Photography[selectedYear];
            finalPrice += prices.Photography[selectedYear];
        }
        if (hasVideo) {
            basePrice += prices.VideoRecording[selectedYear];
            finalPrice += prices.VideoRecording[selectedYear];
        }
    }

    if (hasWeddingSession) {
        basePrice += prices.WeddingSession;
        if (selectedYear === 2022 && hasPhotography) {
        } else if (hasPhotography || hasVideo) {
            finalPrice += prices.WeddingSession / 2;
        } else {
            finalPrice += prices.WeddingSession;
        }
    }

    if (hasBluray && hasVideo) {
        basePrice += prices.BlurayPackage;
        finalPrice += prices.BlurayPackage;
    }

    if (hasTwoDayEvent && (hasPhotography || hasVideo)) {
        basePrice += prices.TwoDayEvent;
        finalPrice += prices.TwoDayEvent;
    }

    return { basePrice, finalPrice };
};
