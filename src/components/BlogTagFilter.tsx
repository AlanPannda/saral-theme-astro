import React, { useEffect, useMemo, useState } from 'react'
import { SITE_BASE } from '@/consts'

interface BlogPost {
	slug: string
	title: string
	description?: string
	pubDate: string
	tags: string[]
	coverImage?: string
}

interface CategoryCtaConfig {
	label?: string
	routes: Record<string, string>
}

interface BlogTagFilterProps {
	posts: BlogPost[]
	availableTags: string[]
	initialTag?: string
	cta?: CategoryCtaConfig
}

export default function BlogTagFilter({
	posts,
	availableTags,
	initialTag,
	cta,
}: BlogTagFilterProps) {
	const tagOptions = useMemo(() => ['All', ...availableTags], [availableTags])
	const normalizedInitialTag = useMemo(() => {
		if (initialTag && tagOptions.includes(initialTag)) {
			return initialTag
		}
		return 'All'
	}, [initialTag, tagOptions])

	const [selectedTag, setSelectedTag] = useState<string>(normalizedInitialTag)

	useEffect(() => {
		setSelectedTag(normalizedInitialTag)
	}, [normalizedInitialTag])

	const filteredPosts = useMemo(() => {
		if (selectedTag === 'All') {
			return posts
		}
		return posts.filter((post) => post.tags.includes(selectedTag))
	}, [selectedTag, posts])

	const ctaHref = useMemo(() => {
		if (!cta) {
			return undefined
		}

		return (
			cta.routes[selectedTag] ??
			cta.routes.All ??
			cta.routes['all'] ??
			'/blog'
		)
	}, [cta, selectedTag])

	const ctaLabel = cta?.label ?? 'Read All'

	return (
		<div className="space-y-8">
			{/* Tag Navigation */}
			<div className="flex flex-wrap gap-2 items-center">
				{tagOptions.map((tag) => (
					<button
						key={tag}
						onClick={() => setSelectedTag(tag)}
						className={`px-4 py-2 rounded-lg font-medium transition-all ${
							selectedTag === tag
								? 'bg-primary dark:bg-primary-dark text-white'
								: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
						}`}
					>
						{tag}
					</button>
				))}
			</div>

			{/* Posts Grid */}
			<div className="posts-grid-container">
				{filteredPosts.length > 0 ? (
					filteredPosts.map((post) => (
						<a
							key={post.slug}
							href={`${SITE_BASE}/blog/${post.slug}/`}
							className="flex flex-col gap-4 pb-8 h-full group transition-colors"
						>
							{post.coverImage && (
								<img
									src={post.coverImage}
									alt={post.title}
									className="object-cover rounded-xl aspect-video"
								/>
							)}
							<h4 className="text-2xl font-semibold group-hover:text-primary dark:group-hover:text-primary-dark group-hover:underline transition-colors">
								{post.title}
							</h4>
							{post.description && (
								<p className="line-clamp-3 opacity-80">{post.description}</p>
							)}
							<p className="uppercase text-sm mt-auto tracking-tight">
								{post.pubDate}
							</p>
						</a>
					))
				) : (
					<p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
						No posts found for this tag.
					</p>
				)}
			</div>

			{ctaHref && (
				<div className="flex justify-end">
					<a
						className="btn-secondary inline-flex items-center gap-2"
						href={ctaHref}
					>
						{ctaLabel}
						<span aria-hidden="true">&rarr;</span>
					</a>
				</div>
			)}
		</div>
	)
}
