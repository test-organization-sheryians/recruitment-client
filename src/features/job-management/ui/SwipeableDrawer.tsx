"use client"

import * as React from "react"
import {
  Drawer,
  Box,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Switch,
  Button,
  Typography,
  IconButton,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

export type QuestionType = "radio" | "text" | "url"

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (q: any) => void
}

export default function AddQuestionDrawer({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [type, setType] = React.useState<QuestionType>("radio")
  const [options, setOptions] = React.useState<string[]>(["0-2 years", "3-5 years"])
  const [required, setRequired] = React.useState(true)
  const [knockout, setKnockout] = React.useState(true)
const [errors, setErrors] = React.useState<{ title?: string; description?: string }>({})



  const addOption = () => setOptions([...options, ""])

  const updateOption = (i: number, val: string) => {
    const arr = [...options]
    arr[i] = val
    setOptions(arr)
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 3 }}>
        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography fontSize={20} fontWeight={700}>Add New Question</Typography>
            <Typography fontSize={13} color="gray">Configure screening logic and input details</Typography>
          </Box>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {/* FORM */}
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
  label="Question Title"
  placeholder="e.g. How many years of experience do you have?"
  value={title}
  onChange={(e) => {
    setTitle(e.target.value)
    setErrors((prev) => ({ ...prev, title: undefined })) // clear error while typing
  }}
  error={!!errors.title}
  helperText={errors.title}
/>


          <TextField
  label="Description"
  placeholder="Provide additional context for the candidate"
  multiline
  rows={3}
  value={description}
  onChange={(e) => {
    setDescription(e.target.value)
    setErrors((prev) => ({ ...prev, description: undefined }))
  }}
  error={!!errors.description}
  helperText={errors.description}
/>


          <Select value={type} onChange={(e) => setType(e.target.value as QuestionType)}>
            <MenuItem value="radio">Radio Buttons</MenuItem>
            <MenuItem value="text">Long Text</MenuItem>
            <MenuItem value="url">URL</MenuItem>
          </Select>

          {/* OPTIONS */}
          {type === "radio" && (
            <Box>
              <Typography fontSize={13} fontWeight={600}>Options</Typography>
              {options.map((opt, i) => (
                <TextField
                  key={i}
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  fullWidth
                  sx={{ mt: 1 }}
                />
              ))}
              <Button onClick={addOption} size="small">+ Add Option</Button>
            </Box>
          )}

          {/* TOGGLES */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>Is Required</Typography>
            <Switch checked={required} onChange={(e) => setRequired(e.target.checked)} />
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>Is Knockout Question</Typography>
            <Switch checked={knockout} onChange={(e) => setKnockout(e.target.checked)} />
          </Box>

          {/* FOOTER */}
          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Button onClick={onClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
  let newErrors: { title?: string;description?: string} = {}
if (!title.trim()) {
  newErrors.title = "This field is required"
}

if (!description.trim()) {
  newErrors.description = "This field is required"
}

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }

  // ===== SUBMIT =====
  onAdd({ title, description, type, options, required, knockout })

  // reset
  setTitle("")
  setDescription("")
  setErrors({})
  onClose()
}}

              sx={{ borderRadius: 3, px: 4 }}
            >
              Create Question
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}
