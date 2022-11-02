export const convertCount = (count: number) => {
    if (count < 1000) {
      return count + "";
    } else if (count < 1000000) {
      return (count / 1000).toFixed(1) + "K";
    } else {
      return (count / 1000000).toFixed(1) + "M";
    }
  };
  
export const convertDate = (createdAt: Date) => {
    const date = new Date(createdAt)
    const now = new Date()
    const hoursBetweenDates = (now.getTime() - date.getTime()) / (60 * 60 * 1000)
  
    if (hoursBetweenDates < 1) {
      const minute = hoursBetweenDates * 60
      if (minute < 1) {
        return 'Just now'
      } 
      return minute.toFixed() + (minute < 2 ? ' min ago' : ' mins ago')
    } else if (hoursBetweenDates < 24) {
      return hoursBetweenDates.toFixed() + (hoursBetweenDates < 2 ? ' hr ago' : ' hrs ago')
    } else if (hoursBetweenDates < 24 * 7) {
      return date.toLocaleString("en-US", {weekday: 'short'})
    } else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleString("en-US", {month: 'long', day: 'numeric'})
    } else {
      return date.toLocaleString("en-US", {month: 'long', day: 'numeric', year: 'numeric'})
    }
  }

  