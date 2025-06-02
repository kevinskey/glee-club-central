import { Holiday } from '@/types/calendar';
import { getEaster } from './easterDate';

export const getReligiousHolidays = (year: number): Holiday[] => {
  const holidays: Holiday[] = [
    {
      id: `easter-${year}`,
      title: "Easter Sunday",
      date: getEaster(year),
      description: "Christian holiday celebrating the resurrection of Jesus Christ",
      imageUrl: "/lovable-uploads/easter.jpg"
    },
    {
      id: `good-friday-${year}`,
      title: "Good Friday",
      date: new Date(getEaster(year).getTime() - (2 * 24 * 60 * 60 * 1000)),
      description: "Christian holiday commemorating the crucifixion of Jesus Christ",
      imageUrl: "/lovable-uploads/good-friday.jpg"
    },
    {
      id: `ascension-day-${year}`,
      title: "Ascension Day",
      date: new Date(getEaster(year).getTime() + (39 * 24 * 60 * 60 * 1000)),
      description: "Christian holiday celebrating Jesus' ascension into heaven",
      imageUrl: "/lovable-uploads/ascension-day.jpg"
    },
    {
      id: `pentecost-${year}`,
      title: "Pentecost",
      date: new Date(getEaster(year).getTime() + (49 * 24 * 60 * 60 * 1000)),
      description: "Christian holiday celebrating the descent of the Holy Spirit",
      imageUrl: "/lovable-uploads/pentecost.jpg"
    },
    {
      id: `assumption-of-mary-${year}`,
      title: "Assumption of Mary",
      date: new Date(year, 7, 15),
      description: "Catholic and Orthodox Christian holiday celebrating Mary's assumption into heaven",
      imageUrl: "/lovable-uploads/assumption-of-mary.jpg"
    },
    {
      id: `all-saints-day-${year}`,
      title: "All Saints' Day",
      date: new Date(year, 10, 1),
      description: "Christian holiday honoring all known and unknown saints",
      imageUrl: "/lovable-uploads/all-saints-day.jpg"
    },
    {
      id: `all-souls-day-${year}`,
      title: "All Souls' Day",
      date: new Date(year, 10, 2),
      description: "Christian holiday commemorating the faithful departed",
      imageUrl: "/lovable-uploads/all-souls-day.jpg"
    },
    {
      id: `immaculate-conception-${year}`,
      title: "Immaculate Conception",
      date: new Date(year, 11, 8),
      description: "Catholic holiday celebrating Mary's conception without original sin",
      imageUrl: "/lovable-uploads/immaculate-conception.jpg"
    },
    {
      id: `bodhi-day-${year}`,
      title: "Bodhi Day",
      date: new Date(year, 11, 8),
      description: "Buddhist holiday celebrating Buddha's enlightenment",
      imageUrl: "/lovable-uploads/bodhi-day.jpg"
    },
    {
      id: `st-lucia-day-${year}`,
      title: "St. Lucia Day",
      date: new Date(year, 11, 13),
      description: "Christian feast day commemorating St. Lucia",
      imageUrl: "/lovable-uploads/st-lucia-day.jpg"
    },
    {
      id: `feast-of-our-lady-of-guadalupe-${year}`,
      title: "Feast of Our Lady of Guadalupe",
      date: new Date(year, 11, 12),
      description: "Catholic celebration of the Virgin Mary's appearance in Mexico",
      imageUrl: "/lovable-uploads/our-lady-of-guadalupe.jpg"
    },
    {
      id: `christmas-eve-${year}`,
      title: "Christmas Eve",
      date: new Date(year, 11, 24),
      description: "Christian celebration on the night before Christmas",
      imageUrl: "/lovable-uploads/christmas-eve.jpg"
    },
    {
      id: `christmas-${year}`,
      title: "Christmas Day",
      date: new Date(year, 11, 25),
      description: "Christian holiday celebrating the birth of Jesus Christ",
      imageUrl: "/lovable-uploads/christmas.jpg"
    },
    {
      id: `boxing-day-${year}`,
      title: "Boxing Day",
      date: new Date(year, 11, 26),
      description: "Traditional holiday celebrated the day after Christmas",
      imageUrl: "/lovable-uploads/boxing-day.jpg"
    },
    {
      id: `kwanzaa-start-${year}`,
      title: "Kwanzaa Begins",
      date: new Date(year, 11, 26), // December 26th
      description: "African-American celebration honoring African heritage and seven core principles",
      imageUrl: "/lovable-uploads/kwanzaa.jpg"
    },
    {
      id: `kwanzaa-umoja-${year}`,
      title: "Kwanzaa - Umoja (Unity)",
      date: new Date(year, 11, 26), // December 26th
      description: "First day of Kwanzaa celebrating Unity",
      imageUrl: "/lovable-uploads/kwanzaa-umoja.jpg"
    },
    {
      id: `kwanzaa-kujichagulia-${year}`,
      title: "Kwanzaa - Kujichagulia (Self-Determination)",
      date: new Date(year, 11, 27), // December 27th
      description: "Second day of Kwanzaa celebrating Self-Determination",
      imageUrl: "/lovable-uploads/kwanzaa-kujichagulia.jpg"
    },
    {
      id: `kwanzaa-ujima-${year}`,
      title: "Kwanzaa - Ujima (Collective Work)",
      date: new Date(year, 11, 28), // December 28th
      description: "Third day of Kwanzaa celebrating Collective Work and Responsibility",
      imageUrl: "/lovable-uploads/kwanzaa-ujima.jpg"
    },
    {
      id: `kwanzaa-ujamaa-${year}`,
      title: "Kwanzaa - Ujamaa (Cooperative Economics)",
      date: new Date(year, 11, 29), // December 29th
      description: "Fourth day of Kwanzaa celebrating Cooperative Economics",
      imageUrl: "/lovable-uploads/kwanzaa-ujamaa.jpg"
    },
    {
      id: `kwanzaa-nia-${year}`,
      title: "Kwanzaa - Nia (Purpose)",
      date: new Date(year, 11, 30), // December 30th
      description: "Fifth day of Kwanzaa celebrating Purpose",
      imageUrl: "/lovable-uploads/kwanzaa-nia.jpg"
    },
    {
      id: `kwanzaa-kuumba-${year}`,
      title: "Kwanzaa - Kuumba (Creativity)",
      date: new Date(year, 11, 31), // December 31st
      description: "Sixth day of Kwanzaa celebrating Creativity",
      imageUrl: "/lovable-uploads/kwanzaa-kuumba.jpg"
    },
    {
      id: `kwanzaa-imani-${year + 1}`,
      title: "Kwanzaa - Imani (Faith)",
      date: new Date(year + 1, 0, 1), // January 1st of next year
      description: "Seventh and final day of Kwanzaa celebrating Faith",
      imageUrl: "/lovable-uploads/kwanzaa-imani.jpg"
    },
    {
      id: `new-years-eve-${year}`,
      title: "New Year's Eve",
      date: new Date(year, 11, 31),
      description: "Celebration on the last day of the year",
      imageUrl: "/lovable-uploads/new-years-eve.jpg"
    },
    {
      id: `epiphany-${year + 1}`,
      title: "Epiphany",
      date: new Date(year + 1, 0, 6),
      description: "Christian festival commemorating the visit of the Magi to the infant Jesus",
      imageUrl: "/lovable-uploads/epiphany.jpg"
    },
    {
      id: `orthodox-christmas-${year + 1}`,
      title: "Orthodox Christmas",
      date: new Date(year + 1, 0, 7),
      description: "Christmas celebration in the Orthodox Christian tradition",
      imageUrl: "/lovable-uploads/orthodox-christmas.jpg"
    },
    {
      id: `orthodox-new-year-${year + 1}`,
      title: "Orthodox New Year",
      date: new Date(year + 1, 0, 14),
      description: "New Year celebration in the Orthodox Christian tradition",
      imageUrl: "/lovable-uploads/orthodox-new-year.jpg"
    },
    {
      id: `chinese-new-year-${year}`,
      title: "Chinese New Year",
      date: new Date(year, 0, 22),
      description: "Celebration of the new year in the Chinese lunisolar calendar",
      imageUrl: "/lovable-uploads/chinese-new-year.jpg"
    },
    {
      id: `mardi-gras-${year}`,
      title: "Mardi Gras",
      date: new Date(year, 1, 21),
      description: "Celebration on the day before Ash Wednesday",
      imageUrl: "/lovable-uploads/mardi-gras.jpg"
    },
    {
      id: `ash-wednesday-${year}`,
      title: "Ash Wednesday",
      date: new Date(year, 1, 22),
      description: "Christian holy day marking the start of Lent",
      imageUrl: "/lovable-uploads/ash-wednesday.jpg"
    },
    {
      id: `st-patricks-day-${year}`,
      title: "St. Patrick's Day",
      date: new Date(year, 2, 17),
      description: "Cultural and religious celebration held on 17 March, the traditional death date of Saint Patrick",
      imageUrl: "/lovable-uploads/st-patricks-day.jpg"
    },
    {
      id: `purim-${year}`,
      title: "Purim",
      date: new Date(year, 2, 24),
      description: "Jewish holiday that commemorates the saving of the Jewish people from Haman",
      imageUrl: "/lovable-uploads/purim.jpg"
    },
    {
      id: `palm-sunday-${year}`,
      title: "Palm Sunday",
      date: new Date(year, 3, 2),
      description: "Christian observance that celebrates the entry of Jesus into Jerusalem",
      imageUrl: "/lovable-uploads/palm-sunday.jpg"
    },
    {
      id: `passover-${year}`,
      title: "Passover",
      date: new Date(year, 3, 5),
      description: "Major Jewish holiday that celebrates the liberation of the Israelites from Egyptian slavery",
      imageUrl: "/lovable-uploads/passover.jpg"
    },
    {
      id: `yom-hashoah-${year}`,
      title: "Yom HaShoah",
      date: new Date(year, 3, 18),
      description: "Annual Holocaust remembrance day",
      imageUrl: "/lovable-uploads/yom-hashoah.jpg"
    },
    {
      id: `yom-haatzmaut-${year}`,
      title: "Yom HaAtzmaut",
      date: new Date(year, 4, 25),
      description: "Israel's Independence Day",
      imageUrl: "/lovable-uploads/yom-haatzmaut.jpg"
    },
    {
      id: `eid-al-fitr-${year}`,
      title: "Eid al-Fitr",
      date: new Date(year, 3, 21),
      description: "Muslim holiday marking the end of Ramadan",
      imageUrl: "/lovable-uploads/eid-al-fitr.jpg"
    },
    {
      id: `eid-al-adha-${year}`,
      title: "Eid al-Adha",
      date: new Date(year, 5, 28),
      description: "Muslim holiday commemorating Abraham's willingness to sacrifice his son",
      imageUrl: "/lovable-uploads/eid-al-adha.jpg"
    },
    {
      id: `rosh-hashanah-${year}`,
      title: "Rosh Hashanah",
      date: new Date(year, 8, 16),
      description: "Jewish New Year",
      imageUrl: "/lovable-uploads/rosh-hashanah.jpg"
    },
    {
      id: `yom-kippur-${year}`,
      title: "Yom Kippur",
      date: new Date(year, 8, 25),
      description: "Jewish Day of Atonement",
      imageUrl: "/lovable-uploads/yom-kippur.jpg"
    },
    {
      id: `sukkot-${year}`,
      title: "Sukkot",
      date: new Date(year, 8, 30),
      description: "Jewish festival celebrating the harvest and the protection of the Israelites in the desert",
      imageUrl: "/lovable-uploads/sukkot.jpg"
    },
    {
      id: `shemini-atzeret-${year}`,
      title: "Shemini Atzeret",
      date: new Date(year, 9, 7),
      description: "Jewish holiday marking the end of Sukkot",
      imageUrl: "/lovable-uploads/shemini-atzeret.jpg"
    },
    {
      id: `simchat-torah-${year}`,
      title: "Simchat Torah",
      date: new Date(year, 9, 8),
      description: "Jewish holiday celebrating the completion of the annual Torah reading cycle",
      imageUrl: "/lovable-uploads/simchat-torah.jpg"
    },
    {
      id: `mawlid-${year}`,
      title: "Mawlid",
      date: new Date(year, 9, 27),
      description: "Muslim holiday celebrating the birth of the Prophet Muhammad",
      imageUrl: "/lovable-uploads/mawlid.jpg"
    },
    {
      id: `diwali-${year}`,
      title: "Diwali",
      date: new Date(year, 10, 12),
      description: "Hindu festival of lights",
      imageUrl: "/lovable-uploads/diwali.jpg"
    },
    {
      id: `hanukkah-${year}`,
      title: "Hanukkah Begins",
      date: getHanukkahStart(year),
      description: "Jewish Festival of Lights, celebrating the rededication of the Temple",
      imageUrl: "/lovable-uploads/hanukkah.jpg"
    }
  ];

  return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Function to calculate the start date of Hanukkah
function getHanukkahStart(year: number): Date {
  const gregorianDates = [
    new Date(2023, 11, 7),
    new Date(2024, 11, 25),
    new Date(2026, 11, 14),
    new Date(2027, 11, 4),
    new Date(2028, 11, 22),
    new Date(2029, 11, 11),
    new Date(2030, 11, 1),
    new Date(2031, 11, 21),
    new Date(2032, 11, 9),
    new Date(2033, 11, 28),
    new Date(2034, 11, 17),
    new Date(2035, 11, 6),
    new Date(2036, 11, 24),
    new Date(2037, 11, 13),
    new Date(2038, 11, 3),
    new Date(2039, 11, 22),
    new Date(2040, 11, 10),
    new Date(2041, 11, 30),
    new Date(2042, 11, 19),
    new Date(2043, 11, 8),
    new Date(2044, 11, 26),
    new Date(2045, 11, 15),
    new Date(2046, 11, 5),
    new Date(2047, 11, 23),
    new Date(2048, 11, 11),
    new Date(2049, 11, 1),
    new Date(2050, 11, 20),
  ];

  const hebrewYears = Array.from({ length: 27 }, (_, i) => 5783 + i);

  const yearIndex = hebrewYears.indexOf(year + 3760);

  if (yearIndex !== -1) {
    return gregorianDates[yearIndex];
  } else {
    // If the year is not in the array, return a default date
    return new Date(year, 11, 1);
  }
}
