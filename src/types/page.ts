export interface BasePageConfig {
    type: 'about' | 'publication' | 'card' | 'text' | 'members';
    title: string;
    description?: string;
}

export interface PublicationPageConfig extends BasePageConfig {
    type: 'publication';
    source: string;
}

export interface TextPageConfig extends BasePageConfig {
    type: 'text';
    source: string;
}

export interface CardItem {
    title: string;
    subtitle?: string;
    date?: string;
    content?: string;
    tags?: string[];
    link?: string;
    image?: string;
}

export interface CardPageConfig extends BasePageConfig {
    type: 'card';
    items: CardItem[];
}

export interface MemberItem {
    name: string;
    homepage?: string;
    avatar?: string;
    role: string;
    category: 'faculty' | 'phd' | 'master' | 'alumni';
    email?: string;
    year?: string;
    interests?: string[];
    note?: string;
}

export interface MemberGroup {
    category: 'faculty' | 'phd' | 'master' | 'alumni';
    label: string;
    members: MemberItem[];
}

export interface MembersPageConfig extends BasePageConfig {
    type: 'members';
    groups: MemberGroup[];
}
