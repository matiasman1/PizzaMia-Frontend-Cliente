interface CountryCode {
    code: string;
    name: string;
    dial_code: string;
    flag: string;
}

export const countryCodes: CountryCode[] = [
    {
        code: "AR",
        name: "Argentina",
        dial_code: "+54",
        flag: "🇦🇷"
    },
    {
        code: "BR",
        name: "Brasil",
        dial_code: "+55",
        flag: "🇧🇷"
    },
    {
        code: "CL",
        name: "Chile",
        dial_code: "+56",
        flag: "🇨🇱"
    },
    {
        code: "CO",
        name: "Colombia",
        dial_code: "+57",
        flag: "🇨🇴"
    },
    {
        code: "MX",
        name: "México",
        dial_code: "+52",
        flag: "🇲🇽"
    },
    {
        code: "PE",
        name: "Perú",
        dial_code: "+51",
        flag: "🇵🇪"
    },
    {
        code: "UY",
        name: "Uruguay",
        dial_code: "+598",
        flag: "🇺🇾"
    },
    {
        code: "US",
        name: "Estados Unidos",
        dial_code: "+1",
        flag: "🇺🇸"
    },
    {
        code: "ES",
        name: "España",
        dial_code: "+34",
        flag: "🇪🇸"
    },
    // AGREGAR PAISES DE SER NECESARIO
];

export const getCountryByDialCode = (dialCode: string): CountryCode | undefined => {
    return countryCodes.find(country => dialCode.includes(country.dial_code));
};

export const getDefaultCountry = (): CountryCode => {
    return countryCodes.find(country => country.code === "AR") || countryCodes[0];
};