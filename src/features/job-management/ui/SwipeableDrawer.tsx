"use client"

import * as React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Switch,
  Button,
  Typography,
  IconButton,
  Box,
  Divider,
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"

export type QuestionType = "radio" | "text" | "url"

interface Props {
  open: boolean
  onClose: () => void
  onAdd: (q: any) => void
}

export default function AddQuestionDialog({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [type, setType] = React.useState<QuestionType>("radio")
  const [options, setOptions] = React.useState<string[]>(["0-2 years", "3-5 years"])
  const [required, setRequired] = React.useState(true)
  const [knockout, setKnockout] = React.useState(false)
  const [errors, setErrors] = React.useState<{ title?: string; description?: string }>({})

  const addOption = () => setOptions([...options, ""])
  const removeOption = (i: number) => setOptions(options.filter((_, index) => index !== i))
  const updateOption = (i: number, val: string) => {
    const arr = [...options]
    arr[i] = val
    setOptions(arr)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: 6,
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Box>
          <Typography fontSize={20} fontWeight={700}>
            Add New Question
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            Configure screening logic and input details
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* CONTENT */}
      <DialogContent sx={{ p: 3, maxHeight: "70vh", overflowY: "auto" }}>
        {/* QUESTION TITLE */}
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Question Title"
            placeholder="e.g. How many years of experience do you have?"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setErrors((prev) => ({ ...prev, title: undefined }))
            }}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
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
            fullWidth
          />

          <Select
            value={type}
            onChange={(e) => setType(e.target.value as QuestionType)}
            fullWidth
          >
            <MenuItem value="radio">Radio Buttons</MenuItem>
            <MenuItem value="text">Long Text</MenuItem>
            <MenuItem value="url">URL</MenuItem>
          </Select>

          {/* OPTIONS */}
          {type === "radio" && (
            <Box mt={2}>
              <Typography fontWeight={600} mb={1}>
                Options
              </Typography>
              {options.map((opt, i) => (
                <Box key={i} display="flex" alignItems="center" gap={1} mb={1}>
                  <TextField
                    value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <IconButton onClick={() => removeOption(i)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
                onClick={addOption}
              >
                Add Option
              </Button>
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* TOGGLES */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography fontSize={14}>Required Question</Typography>
            <Switch checked={required} onChange={(e) => setRequired(e.target.checked)} />
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize={14}>Knockout Question</Typography>
            <Switch checked={knockout} onChange={(e) => setKnockout(e.target.checked)} />
          </Box>
        </Box>
      </DialogContent>

      {/* FOOTER */}
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ borderRadius: 3, px: 4, textTransform: "none" }}
          onClick={() => {
            let newErrors: { title?: string; description?: string } = {}
            if (!title.trim()) newErrors.title = "This field is required"
            if (!description.trim()) newErrors.description = "This field is required"

            if (Object.keys(newErrors).length > 0) {
              setErrors(newErrors)
              return
            }

            onAdd({ title, description, type, options, required, knockout })

            // reset
            setTitle("")
            setDescription("")
            setErrors({})
            setOptions(["0-2 years", "3-5 years"])
            setRequired(true)
            setKnockout(false)
            onClose()
          }}
        >
          Create Question
        </Button>
      </DialogActions>
    </Dialog>
  )
}
