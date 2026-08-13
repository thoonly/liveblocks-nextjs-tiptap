// A mock database with example users
const USER_INFO: Liveblocks["UserMeta"][] = [
  {
    id: "48cdf99f-9cb4-4921-ba92-a8c754c89cd2",
    info: {
      name: "Arm",
      color: "#D583F0",
      avatar: "https://liveblocks.io/avatars/avatar-1.png",
    },
  },
  {
    id: "6796d3f7-7e74-4392-856e-a02de695bf6f",
    info: {
      name: "Thoonly",
      color: "#F08385",
      avatar: "https://liveblocks.io/avatars/avatar-2.png",
    },
  },
  {
    id:"f1b3a7e1-6773-4f81-8916-d426b682d8a3",
    info:{
      name:"Withoon",
      color:"#FFFFF00",
      avatar:"https://liveblocks.io/avatars/avatar-3.png"
    }
  }
];

export function getRandomUser() {
  return USER_INFO[Math.floor(Math.random() * 10) % USER_INFO.length];
}

export function getUser(id: string) {
  return USER_INFO.find((u) => u.id === id) || undefined;
}

export async function getUsers(ids: string[]) {
  return ids.map((id) => getUser(id));
}

export function getAllUsers() {
  return USER_INFO;
}
