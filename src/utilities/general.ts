export const convertToFarsiDigits = (num: number | string | null | undefined): string => {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    if (num === null || num === undefined) {
        return '';
    }

    if (typeof num === 'string') {
        return num.replace(/\d/g, (d) => farsiDigits[parseInt(d)]);
    } else {
        let temp: string;
        if (num < 0) {
            temp = Math.abs(num).toString().replace(/\d/g, (d) => farsiDigits[parseInt(d)]) + '-';
        } else {
            temp = Math.abs(num).toString().replace(/\d/g, (d) => farsiDigits[parseInt(d)]);
        }
        return temp;
    }
};

export const convertStringToInteger=(str:string)=> {  
    const result = parseInt(str, 10); // Base 10  
    return isNaN(result) ? null : result; // Return null for NaN  
}  

