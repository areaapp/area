package com.example.area_android

import android.app.Activity
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.*
import androidx.core.view.children
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import org.json.JSONObject

class ModifyAreaActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_modify_area)

        val app = this.application as AreaApplication

        val intent = this.intent
        val area = JSONObject(intent.getStringExtra("area")!!)

        val areaName = findViewById<TextView>(R.id.name)
        val actionName = findViewById<TextView>(R.id.action)
        val reactionName = findViewById<TextView>(R.id.reaction)
        val actionArgsLayout = findViewById<LinearLayout>(R.id.actionArgsLayout)
        val reactionArgsLayout = findViewById<LinearLayout>(R.id.reactionArgsLayout)

        areaName.text = area.getString("name")
        actionName.text = "Action: " + area.getJSONObject("action").getString("name")
        reactionName.text = "Reaction: " + area.getJSONObject("reaction").getString("name")

        val actionArgs = area.getJSONObject("action").getJSONObject("args")
        val actionIter = actionArgs.keys()
        while (actionIter.hasNext()) {
            val paramName = actionIter.next()
            val edit = EditText(this)
            edit.hint = paramName
            edit.setText(actionArgs.getString(paramName))
            edit.tag = "action_$paramName"

            actionArgsLayout.addView(edit)
        }

        val reactionArgs = area.getJSONObject("reaction").getJSONObject("args")
        val reactionIter = reactionArgs.keys()
        while (reactionIter.hasNext()) {
            val paramName = reactionIter.next()
            val edit = EditText(this)
            edit.hint = paramName
            edit.setText(reactionArgs.getString(paramName))
            edit.tag = "reaction_$paramName"

            reactionArgsLayout.addView(edit)
        }

        val modifyButton = findViewById<Button>(R.id.modifyButton)
        val cancelButton = findViewById<Button>(R.id.cancelButton)

        cancelButton.setOnClickListener {
            setResult(Activity.RESULT_CANCELED)
            finish()
        }

        modifyButton.setOnClickListener {
            val actionArgsObject = HashMap<String, Any>()
            actionArgsLayout.children.forEachIndexed { index, view ->
                view as EditText
                val paramName = view.tag.toString().substring(7)
                val paramValue = view.text.toString()
                actionArgsObject[paramName] = paramValue
            }

            val reactionArgsObject = HashMap<String, Any>()
            reactionArgsLayout.children.forEachIndexed { index, view ->
                view as EditText
                val paramName = view.tag.toString().substring(9)
                val paramValue = view.text.toString()
                reactionArgsObject[paramName] = paramValue
            }

            val requestData = hashMapOf<String, Any?>(
                "name" to areaName.text.toString(),
                "action_args" to actionArgsObject,
                "reaction_args" to reactionArgsObject
            )

            Fuel.put(app.serverUrl + "/me/area/" + area.getInt("id"))
                .authentication()
                .bearer(app.token!!)
                .jsonBody(JSONObject(requestData).toString())
                .responseJson { request, response, result ->
                    when (result) {
                        is Result.Failure -> {
                            Toast.makeText(this, "Failure", Toast.LENGTH_SHORT).show()
                        }
                        is Result.Success -> {
                            Toast.makeText(this, "Success", Toast.LENGTH_SHORT).show()
                            setResult(Activity.RESULT_OK)
                            finish()
                        }
                    }
                }
        }
    }
}
