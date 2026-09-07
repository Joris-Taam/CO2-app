export function validateNumberPlate(numberPlate: string): boolean {
    const numberPlateRegex: Array<RegExp> =
        [/^[A-Z]{2}-[\d]{2}-[\d]{2}$/,
            /^[\d]{2}-[\d]{2}-[A-Z]{2}$/,
            /^[\d]{2}-[A-Z]{2}-[\d]{2}$/,
            /^[A-Z]{2}-[\d]{2}-[A-Z]{2}$/,
            /^[A-Z]{2}-[A-Z]{2}-[\d]{2}$/,
            /^[\d]{2}-[A-Z]{2}-[A-Z]{2}$/,
            /^[A-Z]{3}-[\d]{2}-[A-Z]{1}$/,
            /^[A-Z]{1}-[\d]{2}-[A-Z]{3}$/,
            /^[A-Z]{2}-[\d]{3}-[A-Z]{1}$/,
            /^[A-Z]{1}-[\d]{3}-[A-Z]{2}$/];

    return numberPlateRegex.some(regex => regex.test(numberPlate));
}
