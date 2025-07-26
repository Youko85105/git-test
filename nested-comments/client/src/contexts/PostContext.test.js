import { updateLocalCommentLike } from './PostContext'

describe('updateLocalCommentLike', () => {
  test('increments like count when addLike is true', () => {
    const comments = [{ _id: '1', likeCount: 0, likedByMe: false }]
    const result = updateLocalCommentLike(comments, '1', true)
    expect(result[0].likeCount).toBe(1)
    expect(result[0].likedByMe).toBe(true)
  })

  test('decrements like count but not below zero when addLike is false', () => {
    const comments = [{ _id: '1', likeCount: 1, likedByMe: true }]
    const result = updateLocalCommentLike(comments, '1', false)
    expect(result[0].likeCount).toBe(0)
    expect(result[0].likedByMe).toBe(false)

    const result2 = updateLocalCommentLike(result, '1', false)
    expect(result2[0].likeCount).toBe(0)
  })
})
