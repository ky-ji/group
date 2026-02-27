'use client';

import { motion } from 'framer-motion';
import { MembersPageConfig, MemberItem } from '@/types/page';

const categoryIcons: Record<string, string> = {
    faculty: '🎓',
    phd: '🔬',
    master: '📚',
    alumni: '🌟',
};

function MemberCard({ member, index }: { member: MemberItem; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 * index }}
            className="group bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden"
        >
            <div className="p-5">
                {/* Name & Role */}
                <div className="flex items-center gap-3 mb-3">
                    {member.avatar ? (
                        <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 dark:from-accent/20 dark:to-accent/5 flex items-center justify-center text-lg font-bold text-accent border-2 border-accent/20">
                            {member.name.charAt(0)}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-primary truncate">
                            {member.homepage ? (
                                <a
                                    href={member.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-accent transition-colors"
                                >
                                    {member.name}
                                    <span className="inline-block ml-1 text-xs opacity-0 group-hover:opacity-60 transition-opacity">↗</span>
                                </a>
                            ) : (
                                member.name
                            )}
                        </h3>
                        <p className="text-sm text-accent font-medium">{member.role}</p>
                    </div>
                </div>

                {/* Year */}
                {member.year && (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {member.year}
                    </div>
                )}

                {/* Research Interests */}
                {member.interests && member.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {member.interests.map((interest) => (
                            <span
                                key={interest}
                                className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent dark:bg-accent/15 border border-accent/20"
                            >
                                {interest}
                            </span>
                        ))}
                    </div>
                )}

                {/* Email */}
                {member.email && (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500 mt-2">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${member.email}`} className="hover:text-accent transition-colors">
                            {member.email}
                        </a>
                    </div>
                )}

                {/* Note */}
                {member.note && (
                    <p className="text-xs text-neutral-400 mt-2 italic">{member.note}</p>
                )}
            </div>
        </motion.div>
    );
}

export default function MembersPage({ config, embedded = false }: { config: MembersPageConfig; embedded?: boolean }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            <div className="space-y-10">
                {config.groups.map((group) => (
                    <div key={group.category}>
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-xl">{categoryIcons[group.category] || '👤'}</span>
                            <h2 className={`${embedded ? "text-xl" : "text-2xl"} font-serif font-bold text-primary`}>
                                {group.label}
                            </h2>
                            <span className="text-sm text-neutral-400 ml-1">({group.members.length})</span>
                            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-800 ml-3" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {group.members.map((member, idx) => (
                                <MemberCard key={member.name} member={member} index={idx} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
